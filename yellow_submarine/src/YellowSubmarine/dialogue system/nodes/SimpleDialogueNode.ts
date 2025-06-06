import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";

export class SimpleDialogueNode extends SingleChildDialogueNode{

    constructor(text: string) {
        super(text);
    }

    get mainText(): string {
        return this._text;
    }

}