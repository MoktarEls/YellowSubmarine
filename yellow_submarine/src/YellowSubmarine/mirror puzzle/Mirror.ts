import {AbstractMesh, Angle, MeshBuilder, TransformNode} from "@babylonjs/core";
import {IReceiveLight} from "@/YellowSubmarine/mirror puzzle/IReceiveLight";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class Mirror implements IReceiveLight {

    private _rotationSpeedInDegreesPerSeconds = 45;
    private _targetAngleInDegrees: number;

    private static meshToMirrorMap = new Map<AbstractMesh, Mirror>();
    private _transformNode: TransformNode = new TransformNode("MirrorTransformNode");
    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    private _correctAngleInDegress: number;

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

    constructor(correctAngleInDegress: number, defaultAngle: number) {
        this._correctAngleInDegress = correctAngleInDegress;
        const mesh = MeshBuilder.CreateBox("mirrorMesh", {
            width: 2,
            height: 2,
            depth: 0.2,
        })
        mesh.parent = this._transformNode;
        this._transformNode.rotation.y = Angle.FromDegrees(defaultAngle).radians();
        this._targetAngleInDegrees = defaultAngle;
        Mirror.meshToMirrorMap.set(mesh, this);
    }

    public isRotationCorrect(): boolean{
        return Angle.FromRadians(this._transformNode.rotation.y).degrees() === this._correctAngleInDegress;
    }

    public rotate() {
        // this._targetAngleInDegrees += LerpAngle(this._targetAngleInDegrees, this._targetAngleInDegrees + 45, 1);
        this._targetAngleInDegrees += 45;
    }

    public get angleInDegrees(){
        return Angle.FromRadians(this._transformNode.rotation.y).degrees();
    }

    public static getMirrorFromMesh(mesh: AbstractMesh): Mirror | undefined {
        return this.meshToMirrorMap.get(mesh);
    }

    receiveLight(): void {
        // TODO : Transmit light to next light receiver if correctly rotated
        throw new Error("Not implemented");
    }

    private updateRotation(deltaInSeconds: number){
        const currentRotationDeltaWithTarget = this._targetAngleInDegrees - Angle.FromRadians(this._transformNode.rotation.y).degrees();
        if(Math.abs(currentRotationDeltaWithTarget) > 0.01 ){
            const currentAngleInDegrees = Angle.FromRadians(this._transformNode.rotation.y).degrees();
            const nextAngleInDegrees = Math.min(currentAngleInDegrees + this._rotationSpeedInDegreesPerSeconds * deltaInSeconds, this._targetAngleInDegrees);
            this._transformNode.rotation.y = nextAngleInDegrees;
        }
    }

}