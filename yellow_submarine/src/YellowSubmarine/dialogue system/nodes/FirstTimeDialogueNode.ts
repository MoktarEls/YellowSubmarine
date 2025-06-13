import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export class FirstTimeDialogueNode extends AbstractDialogueNode<boolean>{

    private _firstTimeNode: AbstractDialogueNode<any> | undefined = undefined;
    private _otherTimesNode: AbstractDialogueNode<any> | undefined = undefined;

    private _isFirstTime = true;

    constructor() {
        super();
    }

    get next(): AbstractDialogueNode<any> | undefined {
        return this._isFirstTime ? this._firstTimeNode : this._otherTimesNode;
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

    get bbText(): BBText {
        return new BBTextBuilder().addText("!", SizeTag, 40, BoldTag, ColorTag, "blue").build();
    }

    protected onStart(dialogue: Dialogue): void {
        this._isAutoSkipped = true;
        return;
    }

    protected onEnd(dialogue: Dialogue): void {
        this._isFirstTime = false;
        return;
    }

}