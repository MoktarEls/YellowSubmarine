import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export abstract class SingleChildDialogueNode extends AbstractDialogueNode{

    private _nextNode: AbstractDialogueNode | undefined;

    public set nextNode(value: AbstractDialogueNode | undefined) {
        this._nextNode = value;
    }

    get next(): AbstractDialogueNode | undefined {
        return this._nextNode;
    }

    get children(): AbstractDialogueNode[] {
        if(this._nextNode){
            return [this._nextNode];
        }
        return [];
    }
}