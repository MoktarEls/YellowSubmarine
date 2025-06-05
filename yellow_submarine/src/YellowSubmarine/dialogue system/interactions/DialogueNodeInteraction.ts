import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

export abstract class DialogueNodeInteraction extends AbstractInteraction{

    public abstract get mesh():AbstractMesh | undefined;

    public get conversation(): Conversation{
        return this._conversation;
    }

    constructor(protected _conversation: Conversation, code: string, simplifiedCode: string){
        super(code, simplifiedCode);
    }

}