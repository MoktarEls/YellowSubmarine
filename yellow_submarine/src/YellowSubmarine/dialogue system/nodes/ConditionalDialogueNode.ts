import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class ConditionalDialogueNode extends AbstractDialogueNode {

    private _condition: (() => boolean);
    private _trueNode?: AbstractDialogueNode;
    private _falseNode?: AbstractDialogueNode;

    get trueNode(): AbstractDialogueNode | undefined {
        return this._trueNode;
    }

    set trueNode(value: AbstractDialogueNode | undefined) {
        this._trueNode = value;
    }

    get falseNode(): AbstractDialogueNode | undefined {
        return this._falseNode;
    }

    set falseNode(value: AbstractDialogueNode | undefined) {
        this._falseNode = value;
    }

    constructor(condition: () => boolean, trueNode?: AbstractDialogueNode, falseNode?: AbstractDialogueNode) {
        super("ConditionalDialogueNode");
        this._condition = condition;
        this._trueNode = trueNode;
        this._falseNode = falseNode;
    }

    get children(): AbstractDialogueNode[] {
        const result: AbstractDialogueNode[] = [];
        if(this._trueNode) {
            result.push(this._trueNode);
        }
        if(this._falseNode) {
            result.push(this._falseNode);
        }
        return result;
    }

    get mainText(): string {
        return this.validChild?.mainText ?? this._text;
    }

    get next(): AbstractDialogueNode | undefined {
        return this.validChild?.next;
    }

    private get validChild(): AbstractDialogueNode | undefined {
        return this._condition() ? this._trueNode : this._falseNode;
    }


}