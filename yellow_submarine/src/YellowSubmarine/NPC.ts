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
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Player} from "@/YellowSubmarine/Player";

export class NPC{
    get cameraConfiguration(): CameraConfiguration {
        return this._cameraConfiguration;
    }
    get mesh(): AbstractMesh {
        return this._mesh;
    }

    private _name = "BOB";
    private _mesh: AbstractMesh;
    private _conversation?: Conversation;
    private _startConversationInteraction?: StartConversationInteraction;
    private _playerDetectionZone: MeshDetectionZone;
    private _cameraConfiguration: CameraConfiguration;

    constructor() {
        this._mesh = MeshBuilder.CreateBox("npcBody", {
            height: 5,
            width: 1,
            depth: 1,
        },Game.scene);
        this._mesh.position = new Vector3(-10, 0, -2);

        this._cameraConfiguration = new CameraConfiguration();
        this._cameraConfiguration.target = this._mesh;
        this._cameraConfiguration.distanceFromTarget = 10;
        this._cameraConfiguration.offset = Vector3.Up().scale(2);

        this._playerDetectionZone = new SphericDetectionZone(3, true);
        this._playerDetectionZone.zone.parent = this._mesh;
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