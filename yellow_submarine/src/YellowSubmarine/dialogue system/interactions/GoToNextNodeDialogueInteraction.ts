import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {AbstractDialogueNodeUI} from "@/YellowSubmarine/dialogue system/ui/AbstractDialogueNodeUI";

export class GoToNextNodeDialogueInteraction extends DialogueInteraction{

    protected _start(): void {
        if(AbstractDialogueNodeUI.isTextFullyDisplayed){
            this._dialogue.goToNextNode();
        }
        else{
            AbstractDialogueNodeUI.displayEntireText();
        }
    }

}