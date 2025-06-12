import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class FirstTimeDialogueNode extends AbstractDialogueNode<boolean>{

    private _firstTimeNode: AbstractDialogueNode<any> | undefined = undefined;
    private _otherTimesNode: AbstractDialogueNode<any> | undefined = undefined;

    private _isFirstTime = true;

    get next(): AbstractDialogueNode<any> | undefined {
        const next = this._isFirstTime ? this._firstTimeNode : this._otherTimesNode;
        this._isFirstTime = false;
        return next;
    }

    getChild(index: boolean): AbstractDialogueNode<any> | undefined {
        return index ? this._firstTimeNode : this._otherTimesNode;
    }

    setChild(node: AbstractDialogueNode<any>, index: boolean): void {
        if(index) {
            this._firstTimeNode = node;
        }
        else{
            this._otherTimesNode = node;
        }
    }

}