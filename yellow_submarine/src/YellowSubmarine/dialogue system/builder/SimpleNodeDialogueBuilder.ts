import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {SingleChildNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/SingleChildNodeDialogueBuilder";

export class SimpleNodeDialogueBuilder extends SingleChildNodeDialogueBuilder<SimpleDialogueNode>{

    constructor(text: string) {
        super(new SimpleDialogueNode(text));
    }

 }