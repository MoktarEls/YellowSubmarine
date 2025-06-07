import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SingleChildDialogueNodeBuilder<
    NodeType extends SingleChildDialogueNode
> extends DialogueNodeChainingBuilder<
    void,
    NodeType
>{

    protected chain(nodeToChain: AbstractDialogueNode, index: void): void {
        this._node.nextNode = nodeToChain;
    }


}