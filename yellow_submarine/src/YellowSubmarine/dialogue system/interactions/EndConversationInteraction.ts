import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class EndConversationInteraction extends DialogueNodeInteraction{

    protected _end(): void {
        return;
    }

    protected _onAvailable(): void {
        return;
    }

    protected _onUnavailable(): void {
        return;
    }

    protected _start(): void {
        this._conversation.endConversation();
        this.endOnNextFrame();
    }

    get mesh(): AbstractMesh | undefined {
        return undefined;
    }

}