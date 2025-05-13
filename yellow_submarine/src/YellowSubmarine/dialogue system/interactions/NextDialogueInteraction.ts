import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export class NextDialogueInteraction extends AbstractInteraction{

    public get conversation(){
        return this._conversation;
    }

    constructor(private _conversation:Conversation) {
        super("Space");
    }

    executeInteraction(): void {
        this._conversation.next();
    }

}