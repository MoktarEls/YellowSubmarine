import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {ConditionalDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ConditionalDialogueNodeBuilder";

export class ConditionalDialogueNode extends AbstractDialogueNode<ConditionalDialogueNode, boolean, ConditionalDialogueNodeBuilder> {

    private _condition: (() => boolean);
    private _trueNode?: AbstractDialogueNode<never, never, never>;
    private _falseNode?: AbstractDialogueNode<never, never, never>;

    get trueNode(): AbstractDialogueNode<never, never, never> | undefined {
        return this._trueNode;
    }

    set trueNode(value: AbstractDialogueNode<never, never, never> | undefined) {
        this._trueNode = value;
    }

    get falseNode(): AbstractDialogueNode<never, never, never> | undefined {
        return this._falseNode;
    }

    set falseNode(value: AbstractDialogueNode<never, never, never>| undefined) {
        this._falseNode = value;
    }

    constructor(condition: () => boolean, trueNode?: AbstractDialogueNode<never, never, never>, falseNode?: AbstractDialogueNode<never, never, never>) {
        super("ConditionalDialogueNode");
        this._condition = condition;
        this._trueNode = trueNode;
        this._falseNode = falseNode;
    }

    get children(): AbstractDialogueNode<never, never, never>[] {
        const result: AbstractDialogueNode<never, never, never>[] = [];
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

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return this.validChild?.next;
    }

    private get validChild(): AbstractDialogueNode<never, never, never> | undefined {
        return this._condition() ? this._trueNode : this._falseNode;
    }


}