import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";

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

    abstract getBuilderCtor(): new (node: SelfType) => BuilderType;

    protected _text: string;

    constructor(text: string) {
        this._text = text;
    }

    public abstract get mainText(): string;

    public abstract get children(): AbstractDialogueNode<never, never, never>[];

    public abstract get next(): AbstractDialogueNode<never, never, never> | undefined

    public isFinal(){
        return this.next === undefined;
    }

}
