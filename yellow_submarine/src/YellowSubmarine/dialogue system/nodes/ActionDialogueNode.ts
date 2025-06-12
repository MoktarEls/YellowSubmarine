import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode"
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";

export class ActionDialogueNode extends SingleChildDialogueNode{

    private readonly _executeOnStart: boolean;

    constructor(private _text: string, private _action: () => void, executeOnStart?: boolean) {
        super();
        this._executeOnStart = executeOnStart ?? false;
    }

    protected onStart(): void {
        if(this._executeOnStart) {
            this._action();
        }
    }

    protected onEnd(): void {
        if(!this._executeOnStart) {
            this._action();
        }
    }

    get bbText(): BBText {
        return new BBTextBuilder().addText(`***${this._text}***`, ColorTag, "blue", BoldTag).build();
    }



}