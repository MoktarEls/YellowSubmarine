import {
    AbstractMesh,
    Angle,
    Mesh,
    PBRMaterial, Physics6DoFConstraint,
    PhysicsAggregate, PhysicsMotionType,
    PhysicsShapeType, Quaternion,
    Scalar,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import "@babylonjs/loaders/glTF"
import {Player} from "@/YellowSubmarine/Player";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";

export class Submarine {
    private _physicsAggregate?: PhysicsAggregate;

    public get mesh(): AbstractMesh{
        return this._mesh;
    }

    public static get instance(): Submarine {
        return this._instance;
    }

    private static _instance: Submarine;
    private _mesh!: AbstractMesh;

    private _movementForce = 1000000;

    private _rotationImpulse = 1000000;

    public meshCreationPromise: Promise<AbstractMesh>;

    constructor() {
        Submarine._instance = this;
        this.meshCreationPromise = this.createMesh(Game.scene);
        Game.scene.onBeforeRenderObservable.add(() => {
            this.update(/*Game.engine.getDeltaTime() / 1000*/);
        })
    }

    private async createMesh(scene: Scene) {
        const result = await SceneLoader.ImportMeshAsync("", "models/objects/", "submarine.glb", scene);
        const rootMesh = result.meshes[0] as Mesh;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const mat = mesh.material as PBRMaterial;
            if(mat){
                const toonMat = new CartoonShaderMaterial();
                await toonMat.assignMaterial(mesh).then(() => {
                    toonMat.configureFromPBRMaterial(mat);
                });
            }
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            this._mesh = mergedMesh;
            this._physicsAggregate = new PhysicsAggregate(this._mesh, PhysicsShapeType.CONVEX_HULL,{
                mass: 1,
            }, Game.scene);
            this._physicsAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
            this._physicsAggregate.body.setMassProperties({
                inertia: new Vector3(0, 1, 0),
            });
            this._physicsAggregate.body.setLinearDamping(1);
            this._physicsAggregate.body.setAngularDamping(1);
            this._physicsAggregate.body.getCollisionObservable().add((eventData, eventState) => {
                eventData.collider
            })

            this._mesh.name = "submarine";
            this._mesh.position = new Vector3(0, 0, 0);
        }

        return this._mesh;
    }

    private update() {
        this.updateRotationSpeed();
        this.updateMovementSpeed();
    }

    private updateRotationSpeed() {
        if (!this._physicsAggregate) return;

        const body = this._physicsAggregate.body;

        // Déterminer la direction de rotation en fonction des entrées utilisateur
        let direction = 0;
        if (this.isRightPressed()) direction += 1;
        if (this.isLeftPressed()) direction -= 1;

        if(direction == 0) return;

        body.applyAngularImpulse(this._mesh.right.scale(-direction * this._rotationImpulse));

    }

    private updateMovementSpeed() {
        if (!this._physicsAggregate) return;

        const body = this._physicsAggregate.body;

        let direction = 0;
        if (this.isForwardPressed()) direction += 1;
        if (this.isBackwardPressed()) direction -= 1;

        if (direction === 0) return;

        body.applyForce(this._mesh.forward.scale(direction * this._movementForce), body.getObjectCenterWorld() );

    }

    private isForwardPressed() {
        return Player.isMoveForwardPressed();
    }

    private isBackwardPressed() {
        return Player.isMoveBackwardPressed();
    }

    private isRightPressed() {
        return Player.isTurnRightPressed();
    }

    private isLeftPressed() {
        return Player.isTurnLeftPressed();
    }


}