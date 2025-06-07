import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {SimpleDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeBuilder";

export class SimpleDialogueNode extends SingleChildDialogueNode<SimpleDialogueNode, SimpleDialogueNodeBuilder>{

    constructor(text: string) {
        super(text);
    }

    get mainText(): string {
        return this._text;
    }

}