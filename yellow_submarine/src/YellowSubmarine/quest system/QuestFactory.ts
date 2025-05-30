import {Quest} from "@/YellowSubmarine/quest system/Quest";
import {QuestStep} from "@/YellowSubmarine/quest system/QuestStep";
import {TemplePuzzle} from "@/YellowSubmarine/temple/TemplePuzzle";

export class QuestFactory {

    public static createAll(){
        const quests: Quest[] = [];
        quests.push(QuestFactory.createTalkToPedro());
        quests.push(QuestFactory.createTempleQuest());
        return quests;
    }

    private static createTalkToPedro(): Quest{
        const quest = new Quest("dreamland", "Le monde des rêves", "active", 0);
        const steps: QuestStep[] = [];
        steps.push(new QuestStep("Parlez à l'habitant de l'ile du Dophin"));
        steps.push(new QuestStep("Aller voir le temple"));
        steps.push(new QuestStep("Parler aux différents habitants de chaque île"));
        quest.steps = steps;
        TemplePuzzle.onPuzzleResolved.add(() => {
            quest.state = "completed";
        });
        return quest;
    }

    private static createTempleQuest(): Quest{
        const quest = new Quest("temple_quest", "Le Temple", "inactive", 0);
        const steps: QuestStep[] = [];
        steps.push(new QuestStep("Résoudre l'énigme du temple"));
        quest.steps = steps;
        TemplePuzzle.onPuzzleResolved.add(() => {
            quest.state = "completed";
        });
        return quest;
    }
}