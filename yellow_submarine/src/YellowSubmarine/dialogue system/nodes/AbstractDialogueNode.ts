import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";
import {Constructor} from "@babylonjs/core";

export abstract class AbstractDialogueNode {

    static getBuilderCtor(): new () => any{
        throw new Error(`${this.name} must hide getBuilderCtor !`);
    }

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
