import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class StartConversationInteraction extends WorldInteraction{

    public get description(): string {
        return `Parler`;
    }

    constructor(private _conversation: Dialogue) {
        super();
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.dialogueProvider?.mesh;
    }

    protected _start(): void {
        this._conversation.startDialogue();
        this.endOnNextFrame();
    }

}