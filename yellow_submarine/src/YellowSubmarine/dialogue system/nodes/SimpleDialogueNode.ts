import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export class SimpleDialogueNode extends SingleChildDialogueNode{

    private _bbText: BBText;

    constructor(text: BBText | string){
        super();
        this._bbText = text instanceof BBText ? text : new BBTextBuilder().addText(text).build();
    }

    get bbText(): BBText {
        return this._bbText;
    }

    protected onStart(dialogue: Dialogue): void {
        return;
    }

    protected onEnd(dialogue: Dialogue): void {
        return;
    }





}