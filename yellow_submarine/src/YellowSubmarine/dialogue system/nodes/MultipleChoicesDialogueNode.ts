import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {
    SwitchDialogueNodeInteraction
} from "@/YellowSubmarine/dialogue system/interactions/SwitchDialogueNodeInteraction";

export class MultipleChoicesDialogueNode extends AbstractDialogueNode{

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

    }

}