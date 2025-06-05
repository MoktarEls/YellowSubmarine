import {AbstractMesh, TransformNode} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {World} from "@/YellowSubmarine/World";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";

export class NPC implements IDialogueProvider {

    private _name = "undefined";
    private _mesh?: AbstractMesh;
    private _conversation?: Dialogue;
    private _startConversationInteraction?: StartConversationInteraction;
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

    public get conversation(): Dialogue | undefined {
        return this._conversation;
    }

    public set conversation(conversation: Dialogue | undefined) {
        if(conversation !== undefined) {
            this._startConversationInteraction = new StartConversationInteraction(conversation);
            this._conversation = conversation;
            this._conversation.dialogueProvider = this;

            this._conversation?.onBeforeDialogueEndObservable.add( () =>  {
                if(this._playerDetectionZone?.isInZone(World.instance.submarine.mesh)){
                    // this._startConversationInteraction?.makeAvailable();
                }
            });

        }
        else{
            this._startConversationInteraction = undefined;
            if(this._conversation){
                this._conversation.dialogueProvider = undefined;
            }
            this._conversation = undefined;
        }
    }

    private setSignals(): void {
        if(this._playerDetectionZone){
            this._playerDetectionZone.onMeshEnter.add( () => {
                if(this._startConversationInteraction && !this._conversation?.isInProgress()){
                    // this._startConversationInteraction.makeAvailable();
                }
            } );

            this._playerDetectionZone.onMeshExit.add( () => {
                if(this._startConversationInteraction){
                    // this._startConversationInteraction.makeUnavailable();
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