import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Grid, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";
import {Quest} from "@/YellowSubmarine/quest system/Quest";

export class QuestUI extends UI{

    private _panel: StackPanel;

    get controlNode(): Control {
        return this._panel;
    }

    constructor() {
        super();

        this._panel = new StackPanel();
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._panel.width = "30%";
        this._panel.paddingTop = "10px";
        this._panel.paddingRight = "10px";
        this._panel.isVertical = true;

        Game.scene.onBeforeRenderObservable.add(() => {
            this.refresh();
        });
    }

    private refresh() {
        this._panel.clearControls();
        const activeQuests = QuestManager.instance
            .getAllActiveQuests();

        activeQuests.forEach((quest: Quest) => {
            const container = new Rectangle();
            container.background = "rgba(0, 0, 0, 0.4)";
            container.thickness = 0; // pas de bordure visible
            container.cornerRadius = 10;
            container.height = "50px";
            container.paddingBottom = "5px";
            container.width = "100%";
            container.paddingLeft = "10px";
            container.paddingRight = "10px";

            const questGrid = new Grid();
            questGrid.height = "40px";
            questGrid.addColumnDefinition(0.4); // 40% pour le titre
            questGrid.addColumnDefinition(0.6); // 60% pour la description
            questGrid.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            questGrid.paddingBottom = "5px";
            questGrid.width = "100%";

            const titleText = new TextBlock();
            titleText.text = `🧭 ${quest.name}`;
            titleText.color = "white";
            titleText.fontSize = 20;
            titleText.fontWeight = "bold";
            titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;

            const stepText = new TextBlock();
            stepText.text = quest.steps[quest.currentStepIndex].description;
            stepText.color = "lightgray";
            stepText.fontSize = 16;
            stepText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            stepText.textWrapping = true;
            stepText.paddingLeft = "10px";
            stepText.paddingRight = "10px";

            questGrid.addControl(titleText, 0, 0); // ligne 0, colonne 0
            questGrid.addControl(stepText, 0, 1);  // ligne 0, colonne 1
            container.addControl(questGrid);
            this._panel.addControl(container);
        });
    }
}