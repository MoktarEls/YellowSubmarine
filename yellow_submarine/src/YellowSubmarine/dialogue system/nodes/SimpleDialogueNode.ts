import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {
    SwitchDialogueNodeInteraction
} from "@/YellowSubmarine/dialogue system/interactions/SwitchDialogueNodeInteraction";
import {EndConversationInteraction} from "@/YellowSubmarine/dialogue system/interactions/EndConversationInteraction";

export class SimpleDialogueNode extends AbstractDialogueNode{

    private _nextNode: AbstractDialogueNode | undefined;

    public get nextNode(): AbstractDialogueNode | undefined {
        return this._nextNode;
    }

    public set nextNode(value: AbstractDialogueNode | undefined) {
        this._nextNode = value;
    }

    public isFinal(): boolean {
        return this.nextNode === undefined;
    }

    _enter(): void {
        return;
    }

    _exit(): void {
        return;
    }

    protected initializeInteractionManager(): void {
        this._interactionManager = new InteractionManager<DialogueNodeInteraction>();
        const nextNode = this.nextNode;
        if(nextNode) {
            this._interactionManager.addToAvailableInteraction(new SwitchDialogueNodeInteraction(nextNode, this._conversation, "Space", "_"));
        }
        else{
            this._interactionManager.addToAvailableInteraction(new EndConversationInteraction(this._conversation, "Space", "_"));
        }
    }

}