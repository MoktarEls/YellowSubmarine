import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {ActionDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ActionDialogueNodeBuilder";

export class ActionDialogueNode extends SingleChildDialogueNode<ActionDialogueNode, ActionDialogueNodeBuilder>{

    private _action: (() => void);

    constructor(text: string, action: () => void) {
        super(text);
        this._action = action;
    }

    get mainText(): string {
        return `[c=#0000ff][b]***${this._text}***[/b][/c]`;
    }

    getBuilderCtor() {
        return ActionDialogueNodeBuilder;
    }

}