import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export class SimpleDialogueNode extends SingleChildDialogueNode{

    private _bbText: BBText;

    constructor(text: BBText | string){
        super();
        this._bbText = text instanceof BBText ? text : new BBTextBuilder().addText(text).build();
    }

    get bbText(): BBText {
        return this._bbText;
    }

    protected onStart(): void {
        return;
    }

    protected onEnd(): void {
        return;
    }





}