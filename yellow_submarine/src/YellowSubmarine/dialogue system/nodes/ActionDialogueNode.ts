import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode"
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export class ActionDialogueNode extends SingleChildDialogueNode{

    private readonly _executeOnStart: boolean;

    constructor(private _text: string, private _action: (() => void), executeOnStart: boolean | undefined) {
        super();
        this._executeOnStart = executeOnStart ?? false;
    }

    protected onStart(dialogue: Dialogue): void {
        if(this._executeOnStart) {
            this._action();
        }
    }

    protected onEnd(dialogue: Dialogue): void {
        if(!this._executeOnStart) {
            this._action();
        }
    }

    get bbText(): BBText {
        return new BBTextBuilder().addText(`***${this._text}***`, ColorTag, "blue", BoldTag).build();
    }



}