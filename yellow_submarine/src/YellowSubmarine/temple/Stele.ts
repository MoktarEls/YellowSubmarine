import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {AbstractMesh, Angle} from "@babylonjs/core";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {DialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/DialogueNodeBuilder";
import {SimpleDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeBuilder";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {ConditionalDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ConditionalDialogueNodeBuilder";
import {ActionDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ActionDialogueNode";
import {ActionDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ActionDialogueNodeBuilder";

export class Stele implements IDialogueProvider {
    private _steleInteractionZone!: MeshDetectionZone;
    private _conversation!: Dialogue;
    private _startConversationInteraction?: StartConversationInteraction
    private _cameraConfiguration!: CameraConfiguration;

    public constructor() {
        this.steleInteractionZone = new SphericalDetectionZone({
            diameter: 20
        }, true);
        this._cameraConfiguration = new CameraConfiguration();
        this._cameraConfiguration.target = this._steleInteractionZone.zone;
        this._cameraConfiguration.distanceFromTarget = 20;
        this._cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        const dialogueBuilder =
            DialogueNodeBuilder.createNewDialogueBuilder(SimpleDialogueNode, SimpleDialogueNodeBuilder, this, "La ligne du haut regarde les cieux")
            .chainNode(SimpleDialogueNode, SimpleDialogueNodeBuilder, undefined, "La ligne du milieu respire l'air").resultBuilder
            .chainNode(SimpleDialogueNode, SimpleDialogueNodeBuilder, undefined, "La ligne du bas touche la terre").resultBuilder
            .chainNode(ActionDialogueNode, ActionDialogueNodeBuilder, undefined,
                "Mise à jour du journal et de la quête", () => {
                    let quest = QuestManager.instance.getQuest("temple_quest");
                    if(quest) quest.startQuest();
                    quest = QuestManager.instance.getQuest("dreamland");
                    if(quest) quest.updateCurrentStepStatus();
                    JournalUI.instance.addEntryToQuest(QuestManager.instance.getQuest("temple_quest"), "La stèle nous a donnés des informations sur les rangés : `\n" +
                        " - La ligne du haut regarde les cieux \n" +
                        " - La ligne du milieu respire l’air \n" +
                        " - La ligne du bas touche la terre");
                }
            ).resultBuilder;
        this.dialogue = dialogueBuilder.dialogue;
    }

    public get steleInteractionZone(): MeshDetectionZone {
        return this._steleInteractionZone;
    }

    private set steleInteractionZone(value: MeshDetectionZone) {
        this._steleInteractionZone = value;
        if(this._steleInteractionZone) {
            this._steleInteractionZone.onMeshEnter.add(() => {
                if (this._startConversationInteraction) {
                    // this._startConversationInteraction.makeAvailable();
                }
            })
            this._steleInteractionZone.onMeshExit.add(() => {
                if(this._startConversationInteraction) {
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
            this._startConversationInteraction = new StartConversationInteraction(this._conversation);
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