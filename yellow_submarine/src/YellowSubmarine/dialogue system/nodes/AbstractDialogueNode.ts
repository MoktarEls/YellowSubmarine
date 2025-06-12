import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/DialogueNodeChainingBuilder";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export abstract class AbstractDialogueNode<IndexType> {

    protected _bbText: BBText;

    constructor(text: BBText | string) {
        let bbText: BBText;
        if(text instanceof BBText){
            bbText = text;
        }
        else{
            bbText = new BBTextBuilder().addText(text).build();
        }
        this._bbText = bbText;
    }

    public get bbText(): BBText{
        return this._bbText;
    }

    public abstract get next(): AbstractDialogueNode<any> | undefined

    public abstract getChild(index: IndexType): AbstractDialogueNode<any> | undefined;
    public abstract setChild(node: AbstractDialogueNode<any>, index: IndexType): void;

}
