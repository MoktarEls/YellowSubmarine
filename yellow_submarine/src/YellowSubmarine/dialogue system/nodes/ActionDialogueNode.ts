import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";

export class ActionDialogueNode extends SimpleDialogueNode{

    constructor(private _action: () => void ) {
        super();
        this.text = "ACTION DIALOGUE NODE";
    }

    public enter() {
        super.enter();
    }

    public exit() {
        this._action();
        super.exit();
    }
}