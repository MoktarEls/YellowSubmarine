import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export abstract class AbstractDialogueNode<
    SelfType extends AbstractDialogueNode<
        SelfType,
        IndexType,
        BuilderType
    >,
    IndexType,
    BuilderType extends DialogueNodeChainingBuilder<
        BuilderType,
        IndexType,
        SelfType
    >
> {

    abstract getBuilderCtor(): new (node: any) => BuilderType

    protected _bbText: BBText;

    constructor(text: BBText | string) {
        let bbText: BBText;
        if(text instanceof BBText){
            bbText = text;
        }
        else{
            bbText = new BBTextBuilder().addText(text).build();
        }
        this._bbText = bbText;
    }

    public get bbText(): BBText{
        return this._bbText;
    }

    public abstract get next(): AbstractDialogueNode<any, any, any> | undefined

}
