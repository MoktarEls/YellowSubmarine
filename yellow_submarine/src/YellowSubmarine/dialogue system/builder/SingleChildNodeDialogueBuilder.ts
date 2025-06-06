import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SingleChildNodeDialogueBuilder<T extends SingleChildDialogueNode> extends DialogueNodeBuilder<T, undefined>{

    protected chain(nodeToChain: AbstractDialogueNode, index: undefined): void {
        this._node.nextNode = nodeToChain;
    }


}