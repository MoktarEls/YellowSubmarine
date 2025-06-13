import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";

export class AdvanceDialogueInteraction extends DialogueInteraction{

    protected onStart(): void {
        this._dialogue.goToNextNode();
        this.end();
    }

}