import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export abstract class DialogueNodeInteraction extends AbstractInteraction{

    public abstract get mesh():AbstractMesh | undefined;

    public get conversation(): Dialogue{
        return this._conversation;
    }

    constructor(protected _conversation: Dialogue, code?: string, simplifiedCode?: string){
        super(code, simplifiedCode);
    }

}