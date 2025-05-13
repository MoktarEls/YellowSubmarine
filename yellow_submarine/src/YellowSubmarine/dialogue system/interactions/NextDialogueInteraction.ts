import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export class NextDialogueInteraction extends AbstractInteraction{

    constructor(private _conversation:Conversation) {
        super("Space");
    }

    executeInteraction(): void {
        console.log("Next !");
        this._conversation.next();
    }

}