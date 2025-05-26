import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class StartConversationInteraction extends WorldInteraction{

    public get description(): string {
        return `Talk to ${this._conversation.npc?.name}`;
    }

    constructor(private _conversation: Conversation) {
        super("KeyE");
    }

    executeInteraction(): void {
        this._conversation.startConversation();
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.npc?.mesh;
    }

}