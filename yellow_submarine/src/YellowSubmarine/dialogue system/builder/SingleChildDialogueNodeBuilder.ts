import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SingleChildDialogueNodeBuilder<
    SelfType extends SingleChildDialogueNodeBuilder<
        SelfType,
        NodeType
    >,
    NodeType extends SingleChildDialogueNode<
        NodeType,
        SelfType
    >
> extends DialogueNodeChainingBuilder<
    SelfType,
    void,
    NodeType
>{

    protected chain(nodeToChain: AbstractDialogueNode<never, never, never>, index: void): void {
        this._node.nextNode = nodeToChain;
    }


}