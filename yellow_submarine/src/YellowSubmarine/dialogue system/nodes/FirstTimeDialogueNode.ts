import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";

export class FirstTimeDialogueNode extends AbstractDialogueNode<boolean>{

    private _firstTimeNode: AbstractDialogueNode<any> | undefined = undefined;
    private _otherTimesNode: AbstractDialogueNode<any> | undefined = undefined;

    private _isFirstTime = true;

    constructor() {
        super(new BBTextBuilder().addText("!", SizeTag, 40, BoldTag, ColorTag, "blue").build());
    }

    get next(): AbstractDialogueNode<any> | undefined {
        const next = this._isFirstTime ? this._firstTimeNode : this._otherTimesNode;
        this._isFirstTime = false;
        return next;
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

    protected onStart(): void {
        return;
    }

    protected onEnd(): void {
        return;
    }

}