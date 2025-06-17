import {AbstractMesh, Angle, MeshBuilder, Quaternion, Space, TransformNode, Vector3} from "@babylonjs/core";
import {RotateMirrorInteraction} from "@/YellowSubmarine/mirror puzzle/interaction/RotateMirrorInteraction";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";
import {Utils} from "@/YellowSubmarine/Utils";
import {MirrorLightBeam} from "@/YellowSubmarine/mirror puzzle/MirrorLightBeam";
import {IReceiveLight} from "@/YellowSubmarine/mirror puzzle/IReceiveLight";
import {LerpAngle} from "@babylonjs/core/Maths/math.scalar.functions";

export class Mirror implements IReceiveLight{

    private _transformNode: TransformNode;
    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    private _mesh: AbstractMesh;
    public get mesh() {
        return this._mesh;
    }

    private _rotateMirrorInteraction: RotateMirrorInteraction;

    private _playerDetectionZone: MeshDetectionZone;

    private _rotationSpeedInDegreesPerSeconds = 45;
    private _targetRotationInDegrees;

    private _linkedMirror: Mirror | undefined;
    public get linkedMirror(): Mirror | undefined {
        return this._linkedMirror;
    }
    public set linkedMirror(value: Mirror | undefined) {
        this._linkedMirror = value;
    }

    private _lightBeam: MirrorLightBeam;

    private _nextLightReceiver!: IReceiveLight;
    public get nextLightReceiver(): IReceiveLight {
        return this._nextLightReceiver;
    }
    public set nextLightReceiver(value: IReceiveLight) {
        this._nextLightReceiver = value;
        this._transformNode.rotation.y = Angle.FromDegrees(this.computeCorrectAngleInDegrees()).radians();
        this._targetRotationInDegrees = this.computeCorrectAngleInDegrees();
    }

    constructor(){
        this._transformNode = new TransformNode("mirrorTransformNode");

        this._targetRotationInDegrees = this.currentRotationInDegrees();

        this._mesh = MeshBuilder.CreateBox("mirrorMesh",{
            height: 2,
            width: 2,
            depth: 0.2
        });
        this._mesh.parent = this._transformNode;

        this._rotateMirrorInteraction = new RotateMirrorInteraction(this);

        this._playerDetectionZone = new SphericalDetectionZone({
            diameter: 5
        });
        this._playerDetectionZone.zone.parent = this._transformNode;
        Submarine.instance.meshCreationPromise.then(mesh => {
            this._playerDetectionZone.addMeshToDetect(mesh);
        })
        this._playerDetectionZone.onMeshEnter.add(() => {
            World.instance.worldInteractionManager.addToAvailableInteractions(this._rotateMirrorInteraction);
        })
        this._playerDetectionZone.onMeshExit.add(() => {
            World.instance.worldInteractionManager.removeFromAvailableInteractions(this._rotateMirrorInteraction);
        })

        Game.scene.onBeforeRenderObservable.add(() => {
            const deltaInSeconds = Game.engine.getDeltaTime() / 1000;
            this.updateMirrorRotation(deltaInSeconds);
            this.updateLightBeam();
        })

        this._lightBeam = new MirrorLightBeam(this);

        // TODO : This is for testing, but by default, light beams aren't on
        this._lightBeam.turnOn();
    }

    public async rotate(){
        this._targetRotationInDegrees = (this._targetRotationInDegrees + 45) % 360;

        while(!this.rotationIsCaughtUp()){
            await Utils.sleep(500);
        }
    }

    public receiveLight(): void {
        this._lightBeam.turnOn();
        if(this.isRotationCorrect()){
            this.nextLightReceiver.receiveLight();
        }
        else{
            this.nextLightReceiver.stopReceivingLight();
        }
    }

    public stopReceivingLight(): void {
        this._lightBeam.turnOff();
        this.nextLightReceiver.stopReceivingLight();
    }

    public lightReceiverTransformNode(): TransformNode {
        return this._transformNode;
    }

    // ---------------------------------------------P R I V A T E-------------------------------------------------------

    private currentRotationInDegrees(): number {
        const angle = Angle.FromRadians(this._transformNode.rotation.y).degrees();
        return ((angle % 360) + 360) % 360;
    }

    private updateMirrorRotation(deltaInSeconds: number){
        const current = this.currentRotationInDegrees();
        const target = this._targetRotationInDegrees;

        const maxStep = this._rotationSpeedInDegreesPerSeconds * deltaInSeconds;

        const delta = this.shortestAngleBetween(current, target);

        const step = Math.min(Math.abs(delta), maxStep) * Math.sign(delta);

        const newAngle = (current + step + 360) % 360;

        this._transformNode.rotation.y = Angle.FromDegrees(newAngle).radians();
    }

    private shortestAngleBetween(from: number, to: number): number {
        const diff = ((to - from + 540) % 360) - 180;
        return diff;
    }

    private rotationIsCaughtUp(){
        return Math.abs(this.currentRotationInDegrees() - this._targetRotationInDegrees) <= 0.01;
    }

    private isRotationCorrect(): boolean{
        const currentAngleInDegrees = this.currentRotationInDegrees();
        return Math.abs(this.computeCorrectAngleInDegrees() - currentAngleInDegrees) <= 0.01;
    }

    private updateLightBeam() {
        if(this._lightBeam.isOn()){
            if(this.isRotationCorrect()){
                this.nextLightReceiver.receiveLight();
            }
            else{
                this.nextLightReceiver.stopReceivingLight();
            }
        }
        else{
            this.nextLightReceiver.stopReceivingLight();
        }
    }

    private directionToNextLightReceiver() {
        const lightReceiverTransformNode = this.nextLightReceiver.lightReceiverTransformNode();
        const fromThisToNextLightReceiverDirection = lightReceiverTransformNode.absolutePosition.subtract(this.transformNode.absolutePosition).normalizeToNew();
        return fromThisToNextLightReceiverDirection;
    }

    private computeCorrectAngleInDegrees(): number {
        const direction = this.directionToNextLightReceiver();
        const angleRadians = Math.atan2(direction.x, direction.z);
        return Angle.FromRadians(angleRadians).degrees();
    }

}