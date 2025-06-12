import {AbstractMesh, TransformNode} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {
    StartDialogueInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartDialogueInteraction";
import {World} from "@/YellowSubmarine/World";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";

export class NPC implements IDialogueProvider {

    private _name = "undefined";
    private _mesh?: AbstractMesh;
    private _dialogue?: Dialogue;
    private _startDialogueInteraction?: StartDialogueInteraction;
    private _playerDetectionZone?: MeshDetectionZone;
    private _cameraConfiguration?: CameraConfiguration;

    private _transformNode: TransformNode = new TransformNode("npcTransform");

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public set mesh(value: AbstractMesh | undefined) {
        this._mesh = value;
        if(this._mesh) {
            this._mesh.parent = this._transformNode;
        }
    }
    public get mesh(): AbstractMesh | undefined {
        return this._mesh;
    }

    public get cameraConfiguration(): CameraConfiguration | undefined{
        return this._cameraConfiguration;
    }
    public set cameraConfiguration(value: CameraConfiguration | undefined) {
        this._cameraConfiguration = value;
    }

    public set transformNode(value: TransformNode) {
        this._transformNode = value;
    }

    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    public set detectionZone(value: MeshDetectionZone | undefined ) {
        this._playerDetectionZone = value;
        if(this._playerDetectionZone) {
            this._playerDetectionZone.zone.parent = this._transformNode;
            this.setSignals();
        }
    }
    public get detectionZone(): MeshDetectionZone | undefined {
        return this._playerDetectionZone;
    }

    public get dialogue(): Dialogue | undefined {
        return this._dialogue;
    }

    public set dialogue(dialogue: Dialogue | undefined) {
        if(dialogue !== undefined) {
            this._startDialogueInteraction = new StartDialogueInteraction(dialogue);
            this._dialogue = dialogue;
        }
        else{
            this._startDialogueInteraction = undefined;
            if(this._dialogue){
                this._dialogue.dialogueProvider = undefined;
            }
            this._dialogue = undefined;
        }
    }

    private setSignals(): void {
        if(this._playerDetectionZone){
            this._playerDetectionZone.onMeshEnter.add( () => {
                if(this._startDialogueInteraction && !this._dialogue?.isInProgress()){
                    World.instance.worldInteractionManager.addToAvailableInteraction(this._startDialogueInteraction);
                }
            } );

            this._playerDetectionZone.onMeshExit.add( () => {
                if(this._startDialogueInteraction){
                    World.instance.worldInteractionManager.removeFromAvailableInteraction(this._startDialogueInteraction);
                }
            } );

            World.instance.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
                if(this._playerDetectionZone){
                    this._playerDetectionZone.addMeshToDetect(mesh);
                }
            });

        }
    }
}