import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { Game } from "@/YellowSubmarine/Game";
import { QuestManager } from "@/YellowSubmarine/quest system/QuestManager";
import { Quest } from "@/YellowSubmarine/quest system/Quest";

export class QuestUI extends UI {
    private _panel: StackPanel;

    get controlNode(): Control {
        return this._panel;
    }

    constructor() {
        super();

        this._panel = new StackPanel();
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._panel.width = "25%";
        this._panel.height = "100%";
        this._panel.paddingRight = "10px";
        this._panel.paddingTop = "20px";
        this._panel.isVertical = true;
        this._panel.spacing = 10;

        Game.scene.onBeforeRenderObservable.add(() => {
            this.refresh();
        });
    }

    private refresh() {
        this._panel.clearControls();
        const activeQuests = QuestManager.instance.getAllActiveQuests();

        if (activeQuests.length === 0) {
            // On affiche quand même un séparateur vide
            this._panel.addControl(this.createSeparator());
            return;
        }

        activeQuests.forEach((quest: Quest) => {
            const container = new StackPanel();
            container.isVertical = true;
            container.width = "100%";
            //container.paddingTop = "5px";

            // Titre
            const titleText = new TextBlock();
            titleText.text = `⛋ ${quest.name}`;
            titleText.color = "white";
            titleText.fontSize = 20;
            titleText.fontWeight = "bold";
            titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            titleText.height = "28px";
            titleText.paddingBottom = "6px";

            // Description avec un léger décalage à droite
            const stepText = new TextBlock();
            stepText.text = quest.steps[quest.currentStepIndex].description;
            stepText.color = "#FFFFFF";
            stepText.fontSize = 17;
            stepText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            stepText.height = "28px";
            stepText.textWrapping = true;
            stepText.paddingLeft = "16px"; // Décalage à droite
            stepText.paddingBottom = "10px";

            container.addControl(titleText);
            container.addControl(stepText);
            container.addControl(this.createSeparator());

            this._panel.addControl(container);
        });
    }

    private createSeparator(): Rectangle {
        const separator = new Rectangle();
        separator.height = "5px";
        separator.width = "100%";
        separator.background = "white";
        separator.thickness = 0;
        separator.paddingTop = "4px";
        return separator;
    }

}
