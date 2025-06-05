import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {DialogueInteractionUI} from "@/YellowSubmarine/dialogue system/ui/DialogueInteractionUI";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SwitchDialogueNodeInteraction extends DialogueNodeInteraction{

    constructor(private _newNode: AbstractDialogueNode, conversation: Dialogue, code?: string, simplifiedCode?: string) {
        super(conversation, code, simplifiedCode);
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.dialogueProvider?.mesh;
    }

    get newNode(): AbstractDialogueNode {
        return this._newNode;
    }

    protected _start(): void {
        this._conversation.switchNode(this._newNode);
    }

}