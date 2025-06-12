import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {FirstTimeDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/FirstTimeDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class FirstTimeDialogueNodeChainingBuilder extends DialogueNodeChainingBuilder<FirstTimeDialogueNodeChainingBuilder, boolean, FirstTimeDialogueNode>{

    protected chain(nodeToChain: AbstractDialogueNode<any, any, any>, index: boolean): void {
        if(index){
            this._node.firstTimeNode = nodeToChain;
        }
        else{
            this._node.otherTimesNode = nodeToChain;
        }
    }

}