import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {DialogueNodeUI} from "@/YellowSubmarine/dialogue system/ui/DialogueNodeUI";

export class AdvanceDialogueInteraction extends DialogueInteraction{

    protected onStart(): void {
        if(!DialogueNodeUI.isTextFullyDisplayed){
            DialogueNodeUI.displayEntireText();
        }
        else{
            this._dialogue.goToNextNode();
        }
        this.end();
    }

}