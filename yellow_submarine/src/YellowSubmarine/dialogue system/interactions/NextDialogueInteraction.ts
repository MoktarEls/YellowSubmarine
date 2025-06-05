import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {DialogueInteractionUI} from "@/YellowSubmarine/dialogue system/ui/DialogueInteractionUI";

export class NextDialogueInteraction extends DialogueInteraction{

    constructor(private _conversation:Conversation) {
        super("Space", "_");
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.conversationProvider?.mesh;
    }

    protected _onAvailable(): void {
        return;
    }

    protected _onUnavailable(): void {
        return;
    }

    protected _start(): void {
        if(!DialogueInteractionUI.isTextFullyDisplayed){
            Conversation.onAdvanceDialogueRequested.notifyObservers();
            return;
        }
        this._conversation.next();
    }

    protected _end(): void {
        return;
    }
}