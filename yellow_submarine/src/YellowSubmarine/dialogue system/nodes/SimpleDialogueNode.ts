import {SingleChildDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SingleChildDialogueNode";
import {SimpleDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeBuilder";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export class SimpleDialogueNode extends SingleChildDialogueNode<SimpleDialogueNode, SimpleDialogueNodeBuilder>{

    getBuilderCtor(){
        return SimpleDialogueNodeBuilder;
    }

}