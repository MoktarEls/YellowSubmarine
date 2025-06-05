import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export class ConditionalDialogueNode extends SimpleDialogueNode {

    private _trueNode: AbstractDialogueNode | undefined;
    private _falseNode: AbstractDialogueNode | undefined;

    constructor(dialogue: Dialogue, text: string, private _condition: () => boolean) {
        super(dialogue, text);
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

    get nextNode(): AbstractDialogueNode | undefined {
        return this._condition() ? this._trueNode : this._falseNode;
    }
}