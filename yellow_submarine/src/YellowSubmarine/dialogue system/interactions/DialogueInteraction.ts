import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export abstract class DialogueInteraction extends AbstractInteraction{

    public get mesh():AbstractMesh | undefined{
        return this._dialogue.dialogueProvider?.mesh;
    }

    public get dialogue(): Dialogue{
        return this._dialogue;
    }

    constructor(protected _dialogue: Dialogue){
        super();
    }

}