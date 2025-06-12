import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";


export class SimpleDialogueNode extends AbstractDialogueNode<void>{

    private _nextNode: AbstractDialogueNode<any> | undefined;

    get next(): AbstractDialogueNode<any> | undefined {
        return undefined;
    }

    getChild(index: void) {
        return this._nextNode;
    }

    setChild(index: void, childToSet: AbstractDialogueNode<any>) {
        this._nextNode = childToSet;
    }

}