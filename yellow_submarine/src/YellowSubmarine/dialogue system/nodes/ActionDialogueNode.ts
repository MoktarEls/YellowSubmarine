import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {ActionDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ActionDialogueNodeBuilder";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";

export class ActionDialogueNode extends SingleChildDialogueNode<ActionDialogueNode, ActionDialogueNodeBuilder>{

    private _action: (() => void);

    constructor(text: string, action: () => void) {
        super(new BBTextBuilder().addText(`***${text}***`, BoldTag, ColorTag, "blue").build());
        this._action = action;
    }

    getBuilderCtor() {
        return ActionDialogueNodeBuilder;
    }

}