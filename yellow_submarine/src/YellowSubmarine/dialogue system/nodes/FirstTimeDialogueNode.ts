import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {FirstTimeDialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/FirstTimeDialogueNodeChainingBuilder";

export class FirstTimeDialogueNode extends AbstractDialogueNode<FirstTimeDialogueNode, boolean, FirstTimeDialogueNodeChainingBuilder>{

    private _firstTimeNode: AbstractDialogueNode<any, any, any> | undefined = undefined;
    private _otherTimesNode: AbstractDialogueNode<any, any, any> | undefined = undefined;

    get firstTimeNode(): AbstractDialogueNode<any, any, any> | undefined {
        return this._firstTimeNode;
    }

    set firstTimeNode(value: AbstractDialogueNode<any, any, any> | undefined) {
        this._firstTimeNode = value;
    }

    get otherTimesNode(): AbstractDialogueNode<any, any, any> | undefined {
        return this._otherTimesNode;
    }

    set otherTimesNode(value: AbstractDialogueNode<any, any, any> | undefined) {
        this._otherTimesNode = value;
    }

    private _isFirstTime = true;

    getBuilderCtor(): { new(node: any): FirstTimeDialogueNodeChainingBuilder } {
        return FirstTimeDialogueNodeChainingBuilder;
    }

    get next(): AbstractDialogueNode<any, any, any> | undefined {
        const next = this._isFirstTime ? this._firstTimeNode : this._otherTimesNode;
        this._isFirstTime = false;
        return next;
    }

}