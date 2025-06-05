export abstract class AbstractDialogueNode {

    private _text = "NO TEXT";
    private _nextNode: AbstractDialogueNode | undefined = undefined;

    public get text() : string {
        return this._text;
    }

    public set text(text: string) {
        this._text = text;
    }

    public set nextNode(value: AbstractDialogueNode | undefined) {
        this._nextNode = value;
    }

    public get nextNode(): AbstractDialogueNode | undefined {
        return this._nextNode;
    }

    public abstract execute(): void;

}