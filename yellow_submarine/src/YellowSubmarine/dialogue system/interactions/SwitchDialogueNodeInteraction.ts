import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export class SwitchDialogueNodeInteraction extends DialogueNodeInteraction{

    constructor(private _newNode: AbstractDialogueNode, dialogue: Dialogue, code?: string, simplifiedCode?: string) {
        super(dialogue, code, simplifiedCode);
    }

    get mesh(): AbstractMesh | undefined {
        return this._dialogue.dialogueProvider?.mesh;
    }

    protected _start(): void {
        this._dialogue.switchNode(this._newNode);
    }

}