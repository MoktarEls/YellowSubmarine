import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class StartConversationInteraction extends WorldInteraction{

    public get description(): string {
        return `Parler`;
    }

    constructor(private _conversation: Conversation) {
        super("KeyE", "E");
    }

    executeInteraction(): void {
        this._conversation.startConversation();
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.conversationProvider?.mesh;
    }

}