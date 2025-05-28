import {
    AbstractMesh,
    Color3,
    ImportMeshAsync, ISceneLoaderAsyncResult, LockConstraint,
    Mesh,
    PBRMaterial,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType, Quaternion, TransformNode, Vector3
} from "@babylonjs/core";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Game} from "@/YellowSubmarine/Game";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";
import {RemoveTempleBallInteraction} from "@/YellowSubmarine/temple/interaction/RemoveTempleBallInteraction";
import {PlaceTempleBallInteraction} from "@/YellowSubmarine/temple/interaction/PlaceTempleBallInteraction";
import {CellMaterial} from "@babylonjs/materials";

export class Socle{
    public get currentBall(): TempleBall | undefined{
        return this._currentBall;
    }
    public get mesh(): AbstractMesh {
        return this._mesh;
    }

    private _transformNode: TransformNode = new TransformNode("socle");
    private _ballTransformNode: TransformNode = new TransformNode("ballPosition");
    private _mesh!: AbstractMesh;
    private _material: CellMaterial;
    private _socleDetectionZone: MeshDetectionZone;
    private _validColor?: Color3;
    private _currentBall?: TempleBall;
    private _lockConstraint?: LockConstraint;
    private _placeTempleBallInteraction: PlaceTempleBallInteraction;
    private _removeTempleBallInteraction: RemoveTempleBallInteraction;

    public readonly meshImportedPromise: Promise<void | ISceneLoaderAsyncResult>;

    public constructor(parent: TransformNode, position: Vector3) {

        this._material = new CellMaterial("socleMat");
        this._material.diffuseColor = new Color3(0.3,0.3,0.3);
        this._transformNode.parent = parent;
        this._transformNode.position = position;
        this._ballTransformNode.parent = this._transformNode;
        this._ballTransformNode.position = Vector3.Up().scale(5);
        this._placeTempleBallInteraction = new PlaceTempleBallInteraction(this);
        this._removeTempleBallInteraction = new RemoveTempleBallInteraction(this);


        this._socleDetectionZone = new SphericalDetectionZone({
            diameter: 8,
        }, false);

        Submarine.instance.meshCreationPromise.then((mesh) => {
            this._socleDetectionZone?.addMeshToDetect(mesh);
        });

        this._socleDetectionZone.onMeshEnter.add(() => {
            this.makeInteractionAvailable();
        });

        this._socleDetectionZone.onMeshExit.add(() => {
            this.makeInteractionUnavailable();
        });

        this.meshImportedPromise = ImportMeshAsync("models/objects/socle.glb", Game.scene).then((result) => {
            this._mesh = result.meshes[1];
            this._mesh.parent = this._transformNode;
            this._mesh.material = this._material;
            const physicsBody = new PhysicsBody(this._mesh, PhysicsMotionType.STATIC, false, Game.scene);
            const physicsShape = new PhysicsShape({
                type: PhysicsShapeType.MESH,
                parameters:{
                    mesh: this._mesh as Mesh
                },
            }, Game.scene);
            physicsBody.shape = physicsShape;

            this._socleDetectionZone.zone.parent = this._mesh;
        });

    }

    public placeBall(ball: TempleBall) {
        this._currentBall = ball;
        this._lockConstraint = new LockConstraint(Vector3.Zero(), Vector3.Up().scale(4), Vector3.Up(), Vector3.Down(), Game.scene);
        this._mesh.physicsBody?.addConstraint(ball.physicsBody, this._lockConstraint);
        this._currentBall.socle = this;
        this._material.diffuseColor = new Color3(5,5,5);
    }

    public letGoOfBall(){
        if(this._currentBall){
            this._currentBall = undefined;
            this._lockConstraint?.dispose();
            this._material.diffuseColor = new Color3(0.3,0.3,0.3);
        }
    }

    public get validColor(): Color3 | undefined {
        return this._validColor;
    }

    public set validColor(value: Color3 | undefined) {
        this._validColor = value;
    }

    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    private makeInteractionAvailable(){
        this._placeTempleBallInteraction.makeUnavailable();
        this._removeTempleBallInteraction.makeUnavailable();
        if(this._currentBall && !Submarine.instance.templeBall){
            this._removeTempleBallInteraction.makeAvailable();
        }
        else if(!this._currentBall && Submarine.instance.templeBall){
            this._placeTempleBallInteraction.makeAvailable();
        }
    }

    private makeInteractionUnavailable(){
        this._placeTempleBallInteraction.makeUnavailable();
        this._removeTempleBallInteraction.makeUnavailable();
    }

}