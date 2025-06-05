import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {
    SwitchDialogueNodeInteraction
} from "@/YellowSubmarine/dialogue system/interactions/SwitchDialogueNodeInteraction";
import {
    InteractionManagerInteraction
} from "@/YellowSubmarine/interaction system/interactions/special interactions/InteractionManagerInteraction";
import {
    SelectNextInteraction
} from "@/YellowSubmarine/interaction system/interactions/special interactions/SelectNextInteraction";
import {
    SelectPreviousInteraction
} from "@/YellowSubmarine/interaction system/interactions/special interactions/SelectPreviousInteraction";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";

export class MultipleChoicesDialogueNode extends AbstractDialogueNode{

    private _selectionInteractionManager?: InteractionManager<InteractionManagerInteraction<DialogueNodeInteraction>>;
    public get selectionInteractionManager() {
        return this._selectionInteractionManager;
    }

    constructor(dialogue: Dialogue, private _choices: AbstractDialogueNode[]) {
        super(dialogue);
    }

    isFinal(): boolean {
        return this._choices.length === 0;
    }

    protected _enter(): void {

    }

    protected _exit(): void {

    }

    protected initializeInteractionManager(): void {
        this._interactionManager = new InteractionManager();
        for (let i = 0; i < this._choices.length; i++) {
            const choice = this._choices[i];
            const switchNodeInteraction = new SwitchDialogueNodeInteraction(choice, this._dialogue, `Digit${i}`, `${i}`);
            this._interactionManager.addToAvailableInteraction(switchNodeInteraction);
        }
        this._selectionInteractionManager = new InteractionManager();
        this._selectionInteractionManager.addToAvailableInteraction(new SelectPreviousInteraction(this._interactionManager,"ArrowLeft","←"));
        this._selectionInteractionManager.addToAvailableInteraction(new SelectPreviousInteraction(this._interactionManager,"Space","␣"));
        this._selectionInteractionManager.addToAvailableInteraction(new SelectNextInteraction(this._interactionManager,"ArrowRight","→"));


    }

}