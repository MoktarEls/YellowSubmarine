import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock} from "@babylonjs/gui";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export class DialogueInteractionUI extends UI {

    private _textBlock = new TextBlock();

    constructor() {
        super();
        Conversation.onAnyConversationStart.add(() => this._textBlock.isVisible = true);
        Conversation.onAnyConversationEnd.add(() => this._textBlock.isVisible = false);
        Conversation.onAnyDialogueStart.add((dialog) => this._textBlock.text = dialog.text);
    }

    public get controlNode(): Control {
        return this._textBlock;
    }

}