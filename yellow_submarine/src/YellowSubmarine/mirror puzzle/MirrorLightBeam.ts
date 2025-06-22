import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {
    AbstractMesh,
    Angle, BaseTexture,
    MeshBuilder,
    Space,
    StandardMaterial,
    Texture,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import {loadMesh} from "@/YellowSubmarine/Utils";

export class MirrorLightBeam{

    private _lightState = false;
    private _transformNode: TransformNode;
    private _lightBeamMesh?: AbstractMesh;

    constructor(private _mirror: Mirror) {
        this._transformNode = new TransformNode("lightBeamTransformNode");
        this._transformNode.parent = this._mirror.mirrorTransformNode;

        loadMesh("models/objects/light.glb").then((result) => {
            this._lightBeamMesh = result.meshes[1];
            this._lightBeamMesh.parent = this._transformNode.parent;
            this._lightBeamMesh.position = new Vector3(0,4,0)
            this.updateLightBeamMesh()
        })
/*
        this._lightBeamMesh = MeshBuilder.CreateCylinder("lightBeamMesh",{
            height: 5,
            diameter: 1.5,
            tessellation: 8,
        });
        this._lightBeamMesh.parent = this._transformNode;
        this._lightBeamMesh.rotate(Vector3.Right(), Angle.FromDegrees(90).radians(), Space.WORLD);
        this._lightBeamMesh.position = new Vector3(0,0,2.6);
        this._lightBeamMesh.scaling = new Vector3(4,1,4);
        this._lightBeamMesh.rotate(Vector3.Up(), Angle.FromDegrees(22.5).radians(), Space.LOCAL);
*/

    }

    public turnOn(){
        this._lightState = true;
        this.updateLightBeamMesh();
    }

    public turnOff(){
        this._lightState = false;
        this.updateLightBeamMesh();
    }

    public isOn(){
        return this._lightBeamMesh?.isVisible ?? false;
    }

    private updateLightBeamMesh(){
        if(this._lightBeamMesh){
            this._lightBeamMesh.isVisible = this._lightState;
        }
    }
}