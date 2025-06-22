import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export class ConditionalDialogueNode extends AbstractDialogueNode<boolean>{

    private _trueNode: AbstractDialogueNode<any> | undefined;
    private _falseNode: AbstractDialogueNode<any> | undefined;
    private _condition: ( () => boolean );

    constructor(condition: ( () => boolean )) {
        super();
        this._condition = condition;
        this._isAutoSkipped = true;
    }

    get bbText(): BBText {
        return new BBTextBuilder().addText("CONDITONAL NODE").build();
    }

    getChild(index: boolean): AbstractDialogueNode<any> | undefined {
        if(index){
            return this._trueNode;
        }
        else{
            return this._falseNode;
        }
    }

    get next(): AbstractDialogueNode<any> | undefined {
        if(this._condition()){
            return this._trueNode;
        }
        else{
            return this._falseNode;
        }
    }

    protected onStart(dialogue: Dialogue): void {
        return;
    }

    protected onEnd(dialogue: Dialogue): void {
        return;
    }

    setChild(node: AbstractDialogueNode<any>, index: boolean): void {
        if(index){
            this._trueNode = node;
        }
        else{
            this._falseNode = node;
        }
    }




}