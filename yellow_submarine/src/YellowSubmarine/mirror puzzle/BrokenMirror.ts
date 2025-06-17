import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/DialogueNodeChainingBuilder";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Utils} from "@/YellowSubmarine/Utils";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";

export class BrokenMirror extends Mirror implements IDialogueProvider{

    private _dialogue: Dialogue;

    constructor(){
        super();
        this._dialogue = DialogueNodeChainingBuilder.createNewDialogueBuilder(SimpleDialogueNode, new BBTextBuilder().addText("Ce mirroir semble cassé !!", BoldTag, ColorTag, "red").build()).setDialogueProvider(this).build();
    }

    async rotate(): Promise<void> {
        let isDialogueDone = false;
        this._dialogue.onDialogueEndedObservable.addOnce(() => isDialogueDone = true);
        this._dialogue.startDialogue();

        while(!isDialogueDone){
            await Utils.sleep(500);
        }
    }

    get cameraConfiguration(): CameraConfiguration | undefined {
        return undefined;
    }

    get dialogue(): Dialogue | undefined {
        return this._dialogue
    }

    get name(): string {
        return "Broken Mirror";
    }


}