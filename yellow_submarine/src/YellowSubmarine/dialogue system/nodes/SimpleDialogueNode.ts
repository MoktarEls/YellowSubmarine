import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {
    SimpleDialogueNodeChainingBuilder
} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeChainingBuilder";

export class SimpleDialogueNode extends AbstractDialogueNode<SimpleDialogueNode, void, SimpleDialogueNodeChainingBuilder>{

    private _nextNode: AbstractDialogueNode<any, any, any> | undefined;

    public set nextNode(value: AbstractDialogueNode<any, any, any> | undefined) {
        this._nextNode = value;
    }

    public get nextNode(): AbstractDialogueNode<any, any, any> | undefined {
        return this._nextNode;
    }

    getBuilderCtor(): { new(node: any): SimpleDialogueNodeChainingBuilder } {
        return SimpleDialogueNodeChainingBuilder;
    }

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return undefined;
    }

}