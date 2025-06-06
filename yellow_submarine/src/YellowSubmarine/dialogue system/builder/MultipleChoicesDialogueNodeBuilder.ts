import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {MultipleChoicesDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/MultipleChoicesDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class MultipleChoicesDialogueNodeBuilder extends DialogueNodeBuilder<MultipleChoicesDialogueNode, number | undefined>{

    protected chain(nodeToChain: AbstractDialogueNode, index: number | undefined): void {
        if(!index){
            this._node.addChoice(nodeToChain);
        }
        else{
            this._node.updateChoice(nodeToChain, index);
        }
    }

}