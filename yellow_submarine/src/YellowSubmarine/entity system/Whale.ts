import {FishEntity} from "@/YellowSubmarine/entity system/FishEntity";
import {
    Mesh,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShapeType,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Utils} from "@/YellowSubmarine/Utils";

export class Whale{

    private _entity: FishEntity;
    private _path: Vector3[];
    private _physicsAggregate?: PhysicsAggregate;

    constructor() {
        this._entity = new FishEntity();
        Utils.loadMesh("models/fish/whale.glb").then((result) => {
            const rootMesh = result.meshes[0] as Mesh;
            const childMeshes = rootMesh.getChildMeshes<Mesh>();
            const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
            if(mergedMesh){
                this._entity.mesh = mergedMesh;
                this._physicsAggregate = new PhysicsAggregate(this._entity.mesh, PhysicsShapeType.CONVEX_HULL,{
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
                this._physicsAggregate.body.getCollisionObservable();

                this._entity.mesh.name = "whale";
                this._entity.mesh.position = new Vector3(0, 0, 0);
            }
        });
        this._path = [
            new Vector3(0, -2, 0),
            new Vector3(20, -2, 10),
            new Vector3(40, -2, 0),
            new Vector3(20, -2, -10),
        ];

        Game.scene.onBeforeRenderObservable.add(() => this.update());
    }

    private update() {

    }
}