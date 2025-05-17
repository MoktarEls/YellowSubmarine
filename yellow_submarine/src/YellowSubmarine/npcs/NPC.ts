import {AbstractMesh} from "@babylonjs/core";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {World} from "@/YellowSubmarine/World";

export class NPC{

    private _name = "undefined";
    private _mesh!: AbstractMesh;
    private _conversation?: Conversation;
    private _startConversationInteraction?: StartConversationInteraction;
    private _playerDetectionZone!: MeshDetectionZone;

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }


    public set mesh(value: AbstractMesh) {
        this._mesh = value;
    }
    public get mesh(): AbstractMesh {
        return this._mesh;
    }


    public set detectionZone(value: MeshDetectionZone) {
        this._playerDetectionZone = value;
        if(this._mesh) {
            this._playerDetectionZone.zone.parent = this._mesh;
            this.setSignals();
        }
    }
    public get detectionZone(): MeshDetectionZone {
        return this._playerDetectionZone;
    }
    private setSignals(): void {
        this._playerDetectionZone.onMeshEnter.add( () => {
            if(this._startConversationInteraction && !this._conversation?.isInProgress()){
                this._startConversationInteraction.makeAvailable();
            }
        } );

        this._playerDetectionZone.onMeshExit.add( () => {
            if(this._startConversationInteraction){
                this._startConversationInteraction.makeUnavailable();
            }
        } );

        World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
            this._playerDetectionZone.addMeshToDetect(mesh);
        });
    }


    public get conversation(): Conversation | undefined {
        return this._conversation;
    }
    public set conversation(conversation: Conversation | undefined) {
        if(conversation !== undefined) {
            this._startConversationInteraction = new StartConversationInteraction(conversation);
            this._conversation = conversation;
            this._conversation.npc = this;
        }
        else{
            this._startConversationInteraction = undefined;
            if(this._conversation){
                this._conversation.npc = undefined;
            }
            this._conversation = undefined;

        }
    }


}