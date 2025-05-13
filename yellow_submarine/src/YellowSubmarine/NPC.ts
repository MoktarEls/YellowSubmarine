import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {Game} from "@/YellowSubmarine/Game";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {World} from "@/YellowSubmarine/World";

export class NPC{
    get mesh(): AbstractMesh {
        return this._mesh;
    }

    private _name = "BOB";
    private _mesh: AbstractMesh;
    private _conversation?: Conversation;
    private _conversationInteraction?: StartConversationInteraction;
    private _playerDetectionZone: MeshDetectionZone;

    constructor() {
        this._mesh = MeshBuilder.CreateBox("npcBody", {
            height: 5,
            width: 1,
            depth: 1,
        },Game.scene);
        this._mesh.position = new Vector3(-10, 0, -2);

        this._playerDetectionZone = new SphericDetectionZone(3, true);
        this._playerDetectionZone.zone.parent = this._mesh;
        this._playerDetectionZone.onMeshEnter.add( () => {
            if(this._conversationInteraction){
                this._conversationInteraction.makeAvailable();
            }
        } );
        this._playerDetectionZone.onMeshExit.add( () => {
            if(this._conversationInteraction){
                this._conversationInteraction.makeUnavailable();
            }
        } );
        World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
            this._playerDetectionZone.addMeshToDetect(mesh);
        })

        // For test purpose
        const conversation = new Conversation();
        const dialogue1 = new SimpleDialogueNode();
        dialogue1.text = "Hello";
        const dialogue2 = new SimpleDialogueNode();
        dialogue2.text = "Bye";
        dialogue1.nextNode = dialogue2;
        conversation.root = dialogue1;
        this.conversation = conversation;

    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get conversation(): Conversation | undefined {
        return this._conversation;
    }

    public set conversation(conversation: Conversation | undefined) {
        if(conversation !== undefined) {
            this._conversationInteraction = new StartConversationInteraction(conversation);
            this._conversation = conversation;
            this._conversation.npc = this;
        }
        else{
            this._conversationInteraction = undefined;
            if(this._conversation){
                this._conversation.npc = undefined;
            }
            this._conversation = undefined;

        }
    }


}