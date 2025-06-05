import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {DialogueInteractionUI} from "@/YellowSubmarine/dialogue system/ui/DialogueInteractionUI";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SwitchDialogueNodeInteraction extends DialogueNodeInteraction{

    constructor(private _newNode: AbstractDialogueNode, conversation: Conversation, code?: string, simplifiedCode?: string) {
        super(conversation, code ?? "", simplifiedCode ?? "");
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.conversationProvider?.mesh;
    }

    protected _onAvailable(): void {
        return;
    }

    protected _onUnavailable(): void {
        return;
    }

    protected _start(): void {
        this._conversation.switchNode(this._newNode);
    }

    protected _end(): void {
        return;
    }
}