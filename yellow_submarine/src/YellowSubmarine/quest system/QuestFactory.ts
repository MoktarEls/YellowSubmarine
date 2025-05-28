import {Quest} from "@/YellowSubmarine/quest system/Quest";
import {QuestStep} from "@/YellowSubmarine/quest system/QuestStep";

export class QuestFactory {

    public static createAll(){
        const quests: Quest[] = [];
        quests.push(QuestFactory.createTalkToPedro());
        return quests;
    }

    private static createTalkToPedro(): Quest{
        const quest = new Quest("dreamland", "Le monde des rêves", "active", 0);
        const steps: QuestStep[] = [];
        steps.push(new QuestStep("Parle à l'habitant de l'ile du Dophin", false));
        quest.steps = steps;
        return quest;
    }
}