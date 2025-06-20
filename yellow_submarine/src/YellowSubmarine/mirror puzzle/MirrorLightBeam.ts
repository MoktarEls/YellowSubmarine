import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {AbstractMesh, Angle, MeshBuilder, Space, TransformNode, Vector3} from "@babylonjs/core";

export class MirrorLightBeam{

    private _transformNode: TransformNode;
    private _lightBeamMesh: AbstractMesh;

    constructor(private _mirror: Mirror) {
        this._transformNode = new TransformNode("lightBeamTransformNode");
        this._transformNode.parent = this._mirror.mirrorTransformNode;
        this._transformNode.position = Vector3.Up().scale(4)

        this._lightBeamMesh = MeshBuilder.CreateCylinder("lightBeamMesh",{
            height: 5,
            diameter: 1.5,
            tessellation: 8,
        });
        this._lightBeamMesh.parent = this._transformNode;
        this._lightBeamMesh.rotate(Vector3.Right(), Angle.FromDegrees(90).radians(), Space.WORLD);
        this._lightBeamMesh.position = new Vector3(0,0,2.5);
        this._lightBeamMesh.scaling = new Vector3(4,1,4)
        this.turnOff();
    }

    public turnOn(){
        this._lightBeamMesh.isVisible = true;
    }

    public turnOff(){
        this._lightBeamMesh.isVisible = false;
    }

    public isOn(){
        return this._lightBeamMesh.isVisible;
    }

}