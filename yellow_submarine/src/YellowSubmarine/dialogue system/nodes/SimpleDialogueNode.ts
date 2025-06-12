import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {
    SimpleDialogueNodeChainingBuilder
} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeChainingBuilder";

export class SimpleDialogueNode extends AbstractDialogueNode<SimpleDialogueNode, void, SimpleDialogueNodeChainingBuilder>{

    private _nextNode: AbstractDialogueNode<never, never, never> | undefined;

    public set nextNode(value: AbstractDialogueNode<never, never, never> | undefined) {
        this._nextNode = value;
    }

    public get nextNode(): AbstractDialogueNode<never, never, never> | undefined {
        return this._nextNode;
    }

    getBuilderCtor(): { new(node: any): SimpleDialogueNodeChainingBuilder } {
        return SimpleDialogueNodeChainingBuilder;
    }

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return undefined;
    }

}