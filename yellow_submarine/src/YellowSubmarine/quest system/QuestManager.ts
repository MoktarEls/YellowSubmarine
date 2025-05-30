import {Quest} from "@/YellowSubmarine/quest system/Quest";
import {Game} from "@/YellowSubmarine/Game";
import {QuestFactory} from "@/YellowSubmarine/quest system/QuestFactory";

export class QuestManager {

    private quests: Quest[] = [];

    private static _instance: QuestManager;

    public static get instance(): QuestManager {
        return this._instance;
    }

    constructor() {
        this.quests = QuestFactory.createAll();
        QuestManager._instance = this;
        Game.scene.onBeforeRenderObservable.add(() => {
            this.quests.forEach(quest => {
                if(quest.steps[quest.currentStepIndex].condition && quest.state === "active") {
                    quest.nextStep();
                }
            })
        });

        this.getQuest("dreamland")?.startQuest();

    }

    public getQuest(id: string): Quest | undefined {
        return this.quests.find(quest => quest.id === id);
    }

    public getAllActiveQuests(): Quest[] {
        const quests: Quest[] = [];
        this.quests.forEach(quest => {
            if(quest.state === "active") {
                quests.push(quest);
            }
        });
        return quests;
    }
}