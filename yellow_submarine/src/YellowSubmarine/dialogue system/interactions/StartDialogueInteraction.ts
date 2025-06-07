import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class StartDialogueInteraction extends WorldInteraction{

    public get description(): string {
        return `Parler`;
    }

    constructor(private _dialogue: Dialogue) {
        super();
    }

    get mesh(): AbstractMesh | undefined {
        return this._dialogue.dialogueProvider?.mesh;
    }

    protected _start(): void {
        this._dialogue.startDialogue();
        this.endOnNextFrame();
    }

}