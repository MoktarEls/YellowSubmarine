import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SimpleDialogueNodeChainingBuilder extends DialogueNodeChainingBuilder<SimpleDialogueNodeChainingBuilder, void, SimpleDialogueNode>{

    protected chain(nodeToChain: AbstractDialogueNode<any, any, any>, index: void): void {
        this._node.nextNode = nodeToChain;
    }

}