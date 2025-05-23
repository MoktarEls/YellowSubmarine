import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {GrappleInteraction} from "@/YellowSubmarine/grappling system/interaction/GrappleInteraction";
import {
    AbstractMesh, Mesh,
    MeshBuilder,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType, Vector3
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Game} from "@/YellowSubmarine/Game";
import {Grappler} from "@/YellowSubmarine/grappling system/Grappler";

export class GrabbableObject {
    private _detectionZone: SphericalDetectionZone;
    private _grappleInteraction: GrappleInteraction;
    private _mesh: AbstractMesh;
    private _physicsBody: PhysicsBody;
    private _physicsShape: PhysicsShape;

    public get mesh(): AbstractMesh {
        return this._mesh;
    }

    public get physicsBody(): PhysicsBody {
        return this._physicsBody;
    }

    public constructor(position: Vector3) {
        this._mesh = MeshBuilder.CreateSphere("grabbableObject", {
            diameter: 2,
        });
        this._mesh.position = position;
        this._physicsShape = new PhysicsShape({
            type: PhysicsShapeType.SPHERE,
            parameters: {
                radius: 1,
            }
        }, Game.scene);
        this._physicsBody = new PhysicsBody(this._mesh, PhysicsMotionType.DYNAMIC, false, Game.scene);
        this._physicsBody.shape = this._physicsShape;
        this._physicsBody.setLinearDamping(1);
        this._physicsBody.setMassProperties({
            mass: 0.5,
        });

        this._grappleInteraction = new GrappleInteraction(this);
        this._detectionZone = new SphericalDetectionZone({
            diameter: 4,
        },true);
        this._detectionZone.zone.parent = this._mesh;
        Submarine.instance.meshCreationPromise.then((mesh) => {
           this._detectionZone.addMeshToDetect(mesh);
        });
        this._detectionZone.onMeshEnter.add(() => {
            if(Grappler.instance.hasAnObjectGrappled) return

            this._grappleInteraction.makeAvailable();
        })
        this._detectionZone.onMeshExit.add(() => {
            this._grappleInteraction.makeUnavailable();
        })
    }




}