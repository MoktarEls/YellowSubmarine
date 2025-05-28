import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {GrappleInteraction} from "@/YellowSubmarine/grappling system/interaction/GrappleInteraction";
import {
    AbstractMesh, Color3, Mesh,
    MeshBuilder, Observable,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType, Vector3
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Game} from "@/YellowSubmarine/Game";
import {Grappler} from "@/YellowSubmarine/grappling system/Grappler";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {CellMaterial} from "@babylonjs/materials";
import {TemplePuzzle} from "@/YellowSubmarine/temple/TemplePuzzle";

export class TempleBall {
    private _detectionZone: SphericalDetectionZone;
    private _grappleInteraction: GrappleInteraction;
    private _mesh: AbstractMesh;
    private _physicsBody: PhysicsBody;
    private _physicsShape: PhysicsShape;
    private _socle?: Socle;

    public onPlacedOnSocle = new Observable<Socle>();

    public get mesh(): AbstractMesh {
        return this._mesh;
    }

    public get physicsBody(): PhysicsBody {
        return this._physicsBody;
    }

    public get socle(): Socle | undefined {
        return this._socle;
    }

    public set socle(socle: Socle | undefined) {
        this._socle = socle;
        if(socle){
            this.onPlacedOnSocle.notifyObservers(socle);
        }
    }

    public constructor(position: Vector3, public readonly color: Color3) {
        TemplePuzzle.registerBall(this);
        this._mesh = MeshBuilder.CreateSphere("templeBall", {
            diameter: 2,
        });
        this._mesh.position = position;
        this._physicsShape = new PhysicsShape({
            type: PhysicsShapeType.SPHERE,
            parameters: {
                radius: 1,
            }
        }, Game.scene);
        const cellMaterial = new CellMaterial("templeBallMaterial");
        cellMaterial.diffuseColor = color;
        this._mesh.material = cellMaterial;
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
            if(Grappler.instance.hasAnObjectGrappled || this._socle) return

            this._grappleInteraction.makeAvailable();
        })
        this._detectionZone.onMeshExit.add(() => {
            this._grappleInteraction.makeUnavailable();
        })
    }




}