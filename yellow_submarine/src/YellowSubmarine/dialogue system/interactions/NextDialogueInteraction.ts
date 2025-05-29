import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {DialogueInteraction} from "@/YellowSubmarine/interaction system/interactions/DialogueInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {DialogueInteractionUI} from "@/YellowSubmarine/interaction system/ui/DialogueInteractionUI";

export class NextDialogueInteraction extends DialogueInteraction{

    constructor(private _conversation:Conversation) {
        super("Space");
    }

    executeInteraction(): void {
        if(!DialogueInteractionUI.isTextFullyDisplayed){
            Conversation.onAdvanceDialogueRequested.notifyObservers();
            return;
        }
        this._conversation.next();
    }

    get mesh(): AbstractMesh | undefined {
        const mesh = this._conversation.conversationProvider?.mesh;
        console.log(mesh)
        return mesh;
    }

}