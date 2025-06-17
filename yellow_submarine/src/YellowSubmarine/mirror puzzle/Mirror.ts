import {AbstractMesh, Angle, MeshBuilder, Observable, TransformNode} from "@babylonjs/core";
import {RotateMirrorInteraction} from "@/YellowSubmarine/mirror puzzle/interaction/RotateMirrorInteraction";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";
import {Utils} from "@/YellowSubmarine/Utils";
import {MirrorLightBeam} from "@/YellowSubmarine/mirror puzzle/MirrorLightBeam";

export class Mirror {

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

    private _mirrorLightBeam: MirrorLightBeam;

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
        })

        this._mirrorLightBeam = new MirrorLightBeam(this);

        // TODO : This is for testing, but by default, light beams aren't on
        this._mirrorLightBeam.turnOn();
    }

    public async rotate(){
        this._targetRotationInDegrees += 45;

        while(!this.rotationIsCaughtUp()){
            await Utils.sleep(500);
        }
    }

    private currentRotationInDegrees(){
        return Angle.FromRadians(this._transformNode.rotation.y).degrees();
    }

    private updateMirrorRotation(deltaInSeconds: number){
        if( !this.rotationIsCaughtUp() ){
            const currentRotationInDegrees = this.currentRotationInDegrees();
            const nextRotation = Math.min(this._targetRotationInDegrees, currentRotationInDegrees + this._rotationSpeedInDegreesPerSeconds * deltaInSeconds);
            this._transformNode.rotation.y = Angle.FromDegrees(nextRotation).radians();
        }
    }

    private rotationIsCaughtUp(){
        return Math.abs(this.currentRotationInDegrees() - this._targetRotationInDegrees) <= 0.01;
    }

}