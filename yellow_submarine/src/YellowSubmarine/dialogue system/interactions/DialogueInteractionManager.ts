import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {AdvanceDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/AdvanceDialogueInteraction";
import {KeyboardInput} from "@/YellowSubmarine/KeyboardInput";

export class DialogueInteractionManager extends InteractionManager<DialogueInteraction>{

    public static advanceDialogueInput = new KeyboardInput("Space", "_");

    private _advanceDialogueInteraction : AdvanceDialogueInteraction;

    constructor(private _dialogue : Dialogue) {
        super();
        this._advanceDialogueInteraction = new AdvanceDialogueInteraction(this._dialogue);
        this._dialogue.onDialogueStartedObservable.add(() => {
            this.addToAvailableInteraction(this._advanceDialogueInteraction);
        })
        this._dialogue.onDialogueEndedObservable.add(() => {
            this.removeFromAvailableInteraction(this._advanceDialogueInteraction);
        })
    }

}