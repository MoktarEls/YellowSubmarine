import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class ConditionalNodeDialogueBuilder extends DialogueNodeBuilder<ConditionalDialogueNode>{

    protected chain(nodeToChain: AbstractDialogueNode, index: number | undefined): void {
        if(!index || index === 0) {
            this._node.trueNode = nodeToChain;
        }
        else if(index === 1){
            this._node.falseNode = nodeToChain;
        }
    }

}