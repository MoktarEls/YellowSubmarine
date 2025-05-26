import {
    AbstractMesh,
    Color3,
    ImportMeshAsync,
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

export class Socle{
    public get currentBall(): TempleBall | undefined{
        return this._currentBall;
    }
    public get mesh(): AbstractMesh {
        return this._mesh;
    }

    private _transformNode: TransformNode = new TransformNode("socle");
    private _mesh!: AbstractMesh;
    private _socleDetectionZone: MeshDetectionZone;
    private _validColor?: Color3;
    private _currentBall?: TempleBall;
    private _placeTempleBallInteraction: PlaceTempleBallInteraction;
    private _removeTempleBallInteraction: RemoveTempleBallInteraction;

    public constructor(parent: TransformNode, position: Vector3) {

        this._transformNode.parent = parent;
        this._transformNode.position = position;
        this._placeTempleBallInteraction = new PlaceTempleBallInteraction(this);
        this._removeTempleBallInteraction = new RemoveTempleBallInteraction(this);


        this._socleDetectionZone = new SphericalDetectionZone({
            diameter: 8,
        }, true);

        Submarine.instance.meshCreationPromise.then((mesh) => {
            this._socleDetectionZone?.addMeshToDetect(mesh);
        });

        this._socleDetectionZone.onMeshEnter.add(() => {
            this.makeInteractionAvailable();
        });

        this._socleDetectionZone.onMeshExit.add(() => {
            this.makeInteractionUnavailable();
        });

        ImportMeshAsync("models/objects/socle.glb", Game.scene).then((result) => {
            this._mesh = result.meshes[1];
            this._mesh.parent = this._transformNode;
            const toonShader = new CartoonShaderMaterial();
            toonShader.assignMaterial(this._mesh).then(() => {
                if(this._mesh){
                    const mat = this._mesh.material;
                    if(mat instanceof PBRMaterial){
                        toonShader.configureFromPBRMaterial(this._mesh.material as PBRMaterial);
                    }
                    else{
                        console.log("NOT PBR");
                    }
                }
            });
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
    }

    public letGoOfBall(){
        this._currentBall = undefined;
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