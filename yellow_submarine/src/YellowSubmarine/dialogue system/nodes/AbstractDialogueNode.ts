import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractDialogueNode {

    protected _interactionManager?: InteractionManager<DialogueNodeInteraction>;

    constructor(protected _dialogue: Dialogue, private _text = "NO TEXT") {}

    public abstract isFinal(): boolean;

    public enter(): void {
        this.initializeInteractionManager()
        this._enter();
    }

    public exit(): void {
        this._exit();
        this._interactionManager = undefined;
    }

    public get interactionManager(): InteractionManager<DialogueNodeInteraction> | undefined {
        return this._interactionManager;
    }

    protected _enter(){
        return;
    }

    protected _exit(){
        return;
    }

    protected abstract initializeInteractionManager(): void;

}