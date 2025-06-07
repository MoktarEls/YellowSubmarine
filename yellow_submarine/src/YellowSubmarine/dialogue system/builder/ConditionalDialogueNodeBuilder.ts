import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class ConditionalDialogueNodeBuilder extends DialogueNodeChainingBuilder<boolean, ConditionalDialogueNode> {

    protected chain(nodeToChain: AbstractDialogueNode, index: boolean): void {
        if (index) {
            this._node.trueNode = nodeToChain;
        } else {
            this._node.falseNode = nodeToChain;
        }

    }

}