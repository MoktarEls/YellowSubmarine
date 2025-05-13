import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SimpleDialogueNode extends AbstractDialogueNode{

    execute(): void {
        console.log(this.text);
    }

}