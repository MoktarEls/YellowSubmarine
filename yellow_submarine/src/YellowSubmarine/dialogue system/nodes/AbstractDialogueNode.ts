export abstract class AbstractDialogueNode {

    protected _text: string;

    constructor(text: string) {
        this._text = text;
    }

    public abstract get mainText(): string;

    public abstract get children(): AbstractDialogueNode[];

    public abstract get next(): AbstractDialogueNode | undefined

    public isFinal(){
        return this.next === undefined;
    }

}