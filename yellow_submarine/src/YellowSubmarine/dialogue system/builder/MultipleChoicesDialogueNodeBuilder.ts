import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {MultipleChoicesDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/MultipleChoicesDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class MultipleChoicesDialogueNodeBuilder extends DialogueNodeChainingBuilder<MultipleChoicesDialogueNodeBuilder, number | "add", MultipleChoicesDialogueNode>{

    protected chain(nodeToChain: AbstractDialogueNode<never, never, never>, index: number | "add"): void {
        if(index === "add"){
            this._node.addChoice(nodeToChain);
        }
        else{
            this._node.updateChoice(nodeToChain, index);
        }
    }

}