import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {DialogueInteraction} from "@/YellowSubmarine/interaction system/interactions/DialogueInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class NextDialogueInteraction extends DialogueInteraction{

    constructor(private _conversation:Conversation) {
        super("Space");
    }

    executeInteraction(): void {
        this._conversation.next();
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.npc?.mesh;
    }

}