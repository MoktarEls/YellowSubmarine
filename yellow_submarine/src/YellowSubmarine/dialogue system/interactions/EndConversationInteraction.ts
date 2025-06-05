import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class EndConversationInteraction extends DialogueNodeInteraction{

    protected _start(): void {
        this._dialogue.endDialogue();
        this.endOnNextFrame();
    }

    get mesh(): AbstractMesh | undefined {
        return undefined;
    }

}