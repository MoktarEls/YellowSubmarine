import {FishEntity} from "@/YellowSubmarine/entity system/FishEntity";
import {
    Matrix,
    Mesh, MeshBuilder,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShapeType, Quaternion,
    Scalar,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {loadMesh} from "@/YellowSubmarine/Utils";

export class Whale {

    private _entity: FishEntity;
    private _path: Vector3[];
    private _physicsAggregate?: PhysicsAggregate;
    private _currentTargetIndex = 0;
    private _speed = 20;

    constructor() {
        this._entity = new FishEntity();

        loadMesh("models/fish/whale.glb").then((result) => {
            const rootMesh = result.meshes[0] as Mesh;
            const childMeshes = rootMesh.getChildMeshes<Mesh>();
            const mergedMesh = Mesh.MergeMeshes(childMeshes, true, undefined, undefined, undefined, true);

            if (mergedMesh) {
                this._entity.mesh = mergedMesh;
                this._entity.mesh.position = new Vector3(82, 0, 222);
                this._physicsAggregate = new PhysicsAggregate(this._entity.mesh, PhysicsShapeType.CONVEX_HULL, {
                    mass: 1,
                    friction: 0,
                    restitution: 0,
                    mesh: mergedMesh,
                }, Game.scene);
                this._physicsAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
                this._physicsAggregate.body.setMassProperties({
                    inertia: new Vector3(0, 1, 0),
                    centerOfMass: this._entity.mesh.absolutePosition,
                });
                this._physicsAggregate.body.setLinearDamping(1);
                this._physicsAggregate.body.setAngularDamping(1);
                this._entity.mesh.name = "whale";
            }
        });

        // Chemin à suivre
        this._path = [
            new Vector3(82, 0, 222),
            new Vector3(173, 0, 497),
            new Vector3(-7, 0, 687),
            new Vector3(-168, 0, 471),
            new Vector3(-83, 0, 329),
        ];

        Game.scene.onBeforeRenderObservable.add(() => this.update());
    }

    private update() {
        if (!this._entity.mesh || !this._physicsAggregate) return;

        const target = this._path[this._currentTargetIndex];
        const position = this._entity.mesh.position;
        const toTarget = target.subtract(position);
        const distance = toTarget.length();

        if (distance < 50) {
            this._currentTargetIndex = (this._currentTargetIndex + 1) % this._path.length;
        }

        const direction = toTarget.normalize();

        // Vitesse linéaire vers la cible (avance droit)
        const velocity = direction.scale(this._speed);
        this._physicsAggregate.body.setLinearVelocity(velocity);

        // Calcul quaternion rotation pour que la baleine regarde vers la direction (Z avant)
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

        // Récupérer la position actuelle du corps physique
        const currentPos = this._physicsAggregate.body.transformNode.position;

        // Appliquer position + rotation au corps physique
        this._physicsAggregate.body.transformNode.position = currentPos;
        this._physicsAggregate.body.transformNode.rotation = targetRotation.toEulerAngles();

        this._physicsAggregate.body.setAngularVelocity(Vector3.Zero());
    }

}
