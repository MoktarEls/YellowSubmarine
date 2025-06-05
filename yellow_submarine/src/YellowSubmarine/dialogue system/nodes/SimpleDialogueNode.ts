import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export abstract class SimpleDialogueNode extends AbstractDialogueNode{

    private _nextNode: AbstractDialogueNode | undefined;

    public set nextNode(value: AbstractDialogueNode | undefined) {
        this._nextNode = value;
    }

    public get nextNode(): AbstractDialogueNode | undefined {
        return this._nextNode;
    }

    public execute(): void {
        return;
    }

    public isFinal(): boolean {
        return this.nextNode === undefined;
    }

}