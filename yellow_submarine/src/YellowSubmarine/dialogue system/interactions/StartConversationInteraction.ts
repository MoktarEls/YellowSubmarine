import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export class StartConversationInteraction extends AbstractInteraction{

    constructor(private _conversation: Conversation) {
        super("KeyE");
    }

    executeInteraction(): void {
        console.log("Start conversation !")
        this._conversation.startConversation();
    }

}