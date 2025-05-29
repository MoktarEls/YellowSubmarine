import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {ConversationBuilder} from "@/YellowSubmarine/dialogue system/ConversationBuilder";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";
import {IConversationProvider} from "@/YellowSubmarine/dialogue system/IConversationProvider";
import {AbstractMesh, Angle} from "@babylonjs/core";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Player} from "@/YellowSubmarine/Player";

export class Stele implements IConversationProvider {
    private _steleInteractionZone!: MeshDetectionZone;
    private _conversation!: Conversation;
    private _startConversationInteraction?: StartConversationInteraction
    private _cameraConfiguration!: CameraConfiguration;

    public constructor() {
        this.steleInteractionZone = new SphericalDetectionZone({
            diameter: 10
        }, true);
        this._cameraConfiguration = new CameraConfiguration();
        this._cameraConfiguration.target = this._steleInteractionZone.zone;
        this._cameraConfiguration.distanceFromTarget = 20;
        this._cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        const conversationBuilder = new ConversationBuilder();
        conversationBuilder.say("La ligne du haut regarde les cieux")
            .then("La ligne du milieu respire l’air")
            .then("La ligne du bas touche la terre")
            .setOnEnding(() => {
                let quest = QuestManager.instance.getQuest("temple_quest");
                if(quest) quest.state = "active";
                quest = QuestManager.instance.getQuest("dreamland");
                if(quest) quest.updateCurrentStepStatus();
            })
        this.conversation = conversationBuilder.build();
        this.conversation.conversationProvider = this;
    }

    public get steleInteractionZone(): MeshDetectionZone {
        return this._steleInteractionZone;
    }

    private set steleInteractionZone(value: MeshDetectionZone) {
        this._steleInteractionZone = value;
        if(this._steleInteractionZone) {
            this._steleInteractionZone.onMeshEnter.add(() => {
                if (this._startConversationInteraction) {
                    this._startConversationInteraction.makeAvailable();
                }
            })
            this._steleInteractionZone.onMeshExit.add(() => {
                if(this._startConversationInteraction) {
                    this._startConversationInteraction.makeUnavailable();
                }
            })
            Submarine.instance.meshCreationPromise.then((mesh) => {
                this._steleInteractionZone?.addMeshToDetect(mesh);
            })
        }
    }

    public get conversation(): Conversation {
        return this._conversation;
    }

    private set conversation(value: Conversation) {
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