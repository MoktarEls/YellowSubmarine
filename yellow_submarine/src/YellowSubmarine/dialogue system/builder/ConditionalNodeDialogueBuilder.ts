import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class ConditionalNodeDialogueBuilder extends DialogueNodeBuilder<ConditionalDialogueNode, boolean>{

    protected chain(nodeToChain: AbstractDialogueNode, index: boolean): void {
        if(index){
            this._node.trueNode = nodeToChain;
        }
        else{
            this._node.falseNode = nodeToChain;
        }
    }

}