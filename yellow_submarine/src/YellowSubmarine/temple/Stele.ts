import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {ConversationBuilder} from "@/YellowSubmarine/dialogue system/ConversationBuilder";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";

export class Stele{
    private _steleInteractionZone!: MeshDetectionZone;
    private _conversation!: Conversation;
    private _startConversationInteraction?: StartConversationInteraction

    public constructor() {
        this.steleInteractionZone = new SphericalDetectionZone({
            diameter: 12
        }, true);
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





}