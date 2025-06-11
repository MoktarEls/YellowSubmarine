import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {ConditionalDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ConditionalDialogueNodeBuilder";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";

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

    constructor(condition: () => boolean) {
        super(new BBTextBuilder().addText("CONDITIONAL DIALOGUE NODE", BoldTag, ColorTag, "red").build());
        this._condition = condition;
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

    get bbText(): BBText {
        return this.validChild?.bbText ?? this._bbText;
    }

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return this.validChild?.next;
    }

    private get validChild(): AbstractDialogueNode<never, never, never> | undefined {
        return this._condition() ? this._trueNode : this._falseNode;
    }

    getBuilderCtor() {
        return ConditionalDialogueNodeBuilder;
    }


}