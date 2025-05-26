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

export class Socle{
    private _transformNode: TransformNode = new TransformNode("socle");
    private _mesh!: AbstractMesh;
    private _socleDetectionZone: MeshDetectionZone;
    private _validColor?: Color3;

    public constructor(parent: TransformNode, position: Vector3) {

        this._transformNode.parent = parent;
        this._transformNode.position = position;

        this._socleDetectionZone = new SphericalDetectionZone({
            diameter: 8,
        }, true);

        Submarine.instance.meshCreationPromise.then((mesh) => {
            this._socleDetectionZone?.addMeshToDetect(mesh);
        });

        this._socleDetectionZone.onMeshEnter.add(() => {
            console.log("Socle detection zone entered !!");
        });

        this._socleDetectionZone.onMeshExit.add(() => {
            console.log("Socle detection zone exited !!");
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

    public get validColor(): Color3 | undefined {
        return this._validColor;
    }

    public set validColor(value: Color3 | undefined) {
        this._validColor = value;
    }

    public get transformNode(): TransformNode {
        return this._transformNode;
    }

}