import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SingleChildNodeDialogueBuilder<T extends SingleChildDialogueNode> extends DialogueNodeBuilder<T>{

    protected chain(nodeToChain: AbstractDialogueNode, index: number | undefined): void {
        if(!index || index === 0) {
            this._node.nextNode = nodeToChain;
        }
    }

}