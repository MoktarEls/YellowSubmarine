import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export abstract class SingleChildDialogueNode extends AbstractDialogueNode<void>{

    private _nextNode: AbstractDialogueNode<any> | undefined;

    get next(): AbstractDialogueNode<any> | undefined {
        return this._nextNode;
    }

    getChild(index: void) {
        return this._nextNode;
    }

    setChild(node: AbstractDialogueNode<any>, index: void): void {
        this._nextNode = node;
    }
}