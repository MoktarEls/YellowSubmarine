import { FishEntity } from "@/YellowSubmarine/entity system/FishEntity";
import {
    Matrix,
    Mesh,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShapeType,
    Quaternion,
    Vector3
} from "@babylonjs/core";
import { Game } from "@/YellowSubmarine/Game";
import { loadMesh } from "@/YellowSubmarine/Utils";

export class Whale {
    private _entity: FishEntity;
    private _physicsAggregate?: PhysicsAggregate;
    private _angle = 0; // radians
    private _speed = 0.2; // vitesse angulaire (rad/s)

    // Paramètres de trajectoire
    private _center = new Vector3(0, 0, 300);
    private _radius = 80;

    constructor() {
        this._entity = new FishEntity();
        loadMesh("models/fish/whale.glb").then((result) => {
            const rootMesh = result.meshes[0] as Mesh;
            const childMeshes = rootMesh.getChildMeshes<Mesh>();
            const mergedMesh = Mesh.MergeMeshes(childMeshes, true, undefined, undefined, undefined, true);

            if (mergedMesh) {
                this._entity.mesh = mergedMesh;
                mergedMesh.position = this._center;

                this._physicsAggregate = new PhysicsAggregate(
                    mergedMesh,
                    PhysicsShapeType.MESH,
                    { mass: 1 },
                    Game.scene
                );
                this._physicsAggregate.transformNode.position = this._entity.mesh.position.clone();
                this._physicsAggregate.body.setMassProperties({
                    inertia: new Vector3(0, 1, 0),
                    centerOfMass: this._entity.mesh.absolutePosition,
                });
                this._physicsAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
                this._physicsAggregate.body.setLinearDamping(1);
                this._physicsAggregate.body.setAngularDamping(1);

                this._entity.mesh.name = "whale";
            }
        });

        Game.scene.onBeforeRenderObservable.add(() => this.update());
    }

    private _computePositionOnCircle(angle: number): Vector3 {
        return new Vector3(
            this._center.x + this._radius * Math.cos(angle),
            this._center.y,
            this._center.z + this._radius * Math.sin(angle)
        );
    }

    private update() {
        if (!this._physicsAggregate) return;

        const deltaTime = Game.engine.getDeltaTime() / 1000;
        this._angle += this._speed * deltaTime;

        const newPos = this._computePositionOnCircle(this._angle);
        const currentPos = this._physicsAggregate.transformNode.position;
        const direction = newPos.subtract(currentPos).normalize();
        const velocity = direction.scale(this._speed * this._radius);

        this._physicsAggregate.body.setLinearVelocity(velocity);

        const forward = direction;
        const up = new Vector3(0, 1, 0);
        const right = Vector3.Cross(up, forward).normalize();
        const correctedUp = Vector3.Cross(forward, right);

        const mat = Matrix.FromValues(
            right.x, right.y, right.z, 0,
            correctedUp.x, correctedUp.y, correctedUp.z, 0,
            forward.x, forward.y, forward.z, 0,
            0, 0, 0, 1
        );

        const targetRotation = Quaternion.FromRotationMatrix(mat);
        this._physicsAggregate.transformNode.rotation = targetRotation.toEulerAngles();

        // Stabiliser la rotation
        this._physicsAggregate.body.setAngularVelocity(Vector3.Zero());
    }
}
