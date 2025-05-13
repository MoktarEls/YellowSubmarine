import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export class StartConversationInteraction extends AbstractInteraction{

    public get conversation(): Conversation{
        return this._conversation;
    }

    constructor(private _conversation: Conversation) {
        super("KeyE");
    }

    executeInteraction(): void {
        this._conversation.startConversation();
    }

}