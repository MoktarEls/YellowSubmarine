import {AbstractMesh, Angle, TransformNode} from "@babylonjs/core";
import {IReceiveLight} from "@/YellowSubmarine/mirror puzzle/IReceiveLight";

export class Mirror{

    private _transformNode: TransformNode = new TransformNode("MirrorTransformNode");
    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    private _correctAngleInDegress: number

    private _nextLightReceiver?: IReceiveLight;
    public get nextLightReceiver(): IReceiveLight | undefined {
        return this._nextLightReceiver;
    }
    public set nextLightReceiver(value: IReceiveLight | undefined) {
        this._nextLightReceiver = value;
    }

    private _mesh?: AbstractMesh;
    public get mesh(): AbstractMesh | undefined {
        return this._mesh;
    }

    constructor(correctAngleInDegress: number) {
        this._correctAngleInDegress = correctAngleInDegress;
        // TODO : Initialize mesh
    }

    public isRotationCorrect(): boolean{
        return Angle.FromRadians(this._transformNode.rotation.y).degrees() === this._correctAngleInDegress;
    }

    public rotate(degrees: number) {
        throw new Error("Not implemented");
    }

    public get angleInDegrees(){
        return Angle.FromRadians(this._transformNode.rotation.y).degrees();
    }

}