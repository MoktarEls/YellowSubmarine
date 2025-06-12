import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {AbstractMesh, Angle} from "@babylonjs/core";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";
import {DialogueNodeChainingBuilder} from "@/YellowSubmarine/dialogue system/DialogueNodeChainingBuilder";
import {StartDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/StartDialogueInteraction";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {ActionDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ActionDialogueNode";

export class Stele implements IDialogueProvider {
    private _steleInteractionZone!: MeshDetectionZone;
    private _conversation!: Dialogue;
    private _startDialogueInteraction?: StartDialogueInteraction
    private _cameraConfiguration!: CameraConfiguration;

    public constructor() {
        this.steleInteractionZone = new SphericalDetectionZone({
            diameter: 20
        }, true);
        this._cameraConfiguration = new CameraConfiguration();
        this._cameraConfiguration.target = this._steleInteractionZone.zone;
        this._cameraConfiguration.distanceFromTarget = 20;
        this._cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        const dialogueBuilder = DialogueNodeChainingBuilder
            .createNewDialogueBuilder(SimpleDialogueNode,"La ligne du haut regarde les cieux")
            .chainNode(SimpleDialogueNode, "La ligne du milieu respire l'air")
            .chainNode(SimpleDialogueNode, "La ligne du bas touche la terre")
            .chainNode(ActionDialogueNode, "Mise à jour du journal et de la quête", () => {
                let quest = QuestManager.instance.getQuest("temple_quest");
                if(quest) quest.startQuest();
                quest = QuestManager.instance.getQuest("dreamland");
                if(quest) quest.updateCurrentStepStatus();
                JournalUI.instance.addEntryToQuest(QuestManager.instance.getQuest("temple_quest"), "La stèle nous a donnés des informations sur les rangés : `\n" +
                    " - La ligne du haut regarde les cieux \n" +
                    " - La ligne du milieu respire l’air \n" +
                    " - La ligne du bas touche la terre");
            })
            .setDialogueProvider(this);

        this.dialogue = dialogueBuilder.build();
    }

    public get steleInteractionZone(): MeshDetectionZone {
        return this._steleInteractionZone;
    }

    private set steleInteractionZone(value: MeshDetectionZone) {
        this._steleInteractionZone = value;
        if(this._steleInteractionZone) {
            this._steleInteractionZone.onMeshEnter.add(() => {
                if (this._startDialogueInteraction) {
                    // this._startConversationInteraction.makeAvailable();
                }
            })
            this._steleInteractionZone.onMeshExit.add(() => {
                if(this._startDialogueInteraction) {
                    // this._startConversationInteraction.makeUnavailable();
                }
            })
            Submarine.instance.meshCreationPromise.then((mesh) => {
                this._steleInteractionZone?.addMeshToDetect(mesh);
            })
        }
    }

    public get dialogue(): Dialogue {
        return this._conversation;
    }

    private set dialogue(value: Dialogue) {
        this._conversation = value;
        if(this._conversation) {
            this._startDialogueInteraction = new StartDialogueInteraction(this._conversation);
        }
    }

    get mesh(): AbstractMesh | undefined {
        return this._steleInteractionZone.zone;
    }

    get name(): string {
        return "Stele";
    }

    get cameraConfiguration(): CameraConfiguration | undefined {
        return this._cameraConfiguration;
    }





}