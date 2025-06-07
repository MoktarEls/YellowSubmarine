import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeChainingBuilder";

export abstract class SingleChildDialogueNode<
    SelfType extends SingleChildDialogueNode<
        SelfType,
        BuilderType
    >,
    BuilderType extends DialogueNodeChainingBuilder<
        BuilderType,
        void,
        SelfType
    >
> extends AbstractDialogueNode<
    SelfType,
    void,
    BuilderType
> {

    private _nextNode: AbstractDialogueNode<never, never, never> | undefined;

    public set nextNode(value: AbstractDialogueNode<never, never, never> | undefined) {
        this._nextNode = value;
    }

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return this._nextNode;
    }

    get children(): AbstractDialogueNode<never, never, never>[] {
        if(this._nextNode){
            return [this._nextNode];
        }
        return [];
    }

}