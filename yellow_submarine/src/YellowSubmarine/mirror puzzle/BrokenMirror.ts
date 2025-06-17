import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/DialogueNodeChainingBuilder";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {AbstractMesh} from "@babylonjs/core";

export class BrokenMirror extends Mirror implements IDialogueProvider{

    private _dialogue: Dialogue;

    constructor(correctAngleInDegress: number) {
        super(correctAngleInDegress);
        this._dialogue =
        DialogueNodeChainingBuilder.createNewDialogueBuilder(SimpleDialogueNode, new BBTextBuilder().addText("Ce mirroir semble cassé. Il refuse de tourner...", ColorTag, "red").build())
            .setDialogueProvider(this)
            .build();
    }

    rotate(degrees: number) {
        this._dialogue.startDialogue();
    }
    get cameraConfiguration(): CameraConfiguration | undefined {
        return undefined;
    }

    get dialogue(): Dialogue | undefined {
        return undefined;
    }

    get mesh(): AbstractMesh | undefined {
        throw new Error("Not implemented.");
    }

    get name(): string {
        return "BrokenMirror";
    }
}