import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";

export class GoToNextNodeDialogueInteraction extends DialogueInteraction{

    protected _start(): void {
        this._dialogue.goToNextNode();
    }



}