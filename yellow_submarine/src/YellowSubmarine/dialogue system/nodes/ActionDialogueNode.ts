import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export class ActionDialogueNode extends SimpleDialogueNode{

    private readonly _executeOnEnter: boolean;

    constructor(dialogue: Dialogue, private _action: () => void, executeOnEnter?: boolean) {
        super(dialogue);
        this._executeOnEnter = executeOnEnter ?? false;
        this.text = "ACTION DIALOGUE NODE";
    }

    public enter() {
        super.enter();
        if(this._executeOnEnter) {
            this._action();
        }
    }

    public exit() {
        if(!this._executeOnEnter) {
            this._action();
        }
        super.exit();
    }
}