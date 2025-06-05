import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractDialogueNode {

    private _text = "NO TEXT";
    protected _interactionManager?: InteractionManager<DialogueNodeInteraction>;

    constructor(protected _conversation: Conversation) {}

    protected get text(): string {
        return this._text;
    }

    protected set text(value: string) {
        this._text = value;
    }

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

    protected abstract _enter(): void;

    protected abstract _exit(): void;

    protected abstract initializeInteractionManager(): void;

}