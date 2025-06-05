import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class ConditionalDialogueNode extends AbstractDialogueNode {

    private _trueNode: AbstractDialogueNode | undefined;
    private _falseNode: AbstractDialogueNode | undefined;

    constructor(private _condition: () => boolean) {
        super();
    }

    public set trueNode(node: AbstractDialogueNode | undefined) {
        this._trueNode = node;
    }

    public get trueNode(): AbstractDialogueNode | undefined {
        return this._trueNode;
    }

    public set falseNode(node: AbstractDialogueNode | undefined) {
        this._trueNode = node;
    }

    public get falseNode(): AbstractDialogueNode | undefined {
        return this._trueNode;
    }

    enter(): void {
        return;
    }

    exit(): void {
        return;
    }

    isFinal(): boolean {
        return this.getNextNode() === undefined;
    }

    private getNextNode(): AbstractDialogueNode | undefined {
        return this._condition() ? this._trueNode : this._falseNode;
    }


}