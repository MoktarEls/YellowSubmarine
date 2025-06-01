import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { QuestManager } from "@/YellowSubmarine/quest system/QuestManager";
import { Quest } from "@/YellowSubmarine/quest system/Quest";
import {Animation} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {DayNightCycle} from "@/YellowSubmarine/sky system/DayNightCycle";

export class QuestUI extends UI {

    private readonly _panel: StackPanel;
    private static _instance: QuestUI;


    get controlNode(): Control {
        return this._panel;
    }

    public static get instance(): QuestUI {
        return this._instance;
    }

    private _isDay = true;

    constructor() {
        super();

        QuestUI._instance = this;
        this._panel = new StackPanel();
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._panel.width = "25%";
        this._panel.height = "100%";
        this._panel.paddingRight = "10px";
        this._panel.paddingTop = "20px";
        this._panel.isVertical = true;
        this._panel.spacing = 25;

        DayNightCycle.onDayChanged.add(() => {
            this._isDay = !this._isDay;
            this.refresh();
        })

    }

    public refresh() {
        this._panel.clearControls();
        const activeQuests = QuestManager.instance.getAllActiveQuests();

        if (activeQuests.length === 0) {
            this._panel.addControl(this.createSeparator());
            return;
        }

        activeQuests.forEach((quest: Quest, index) => {
            const container = new StackPanel();
            container.isVertical = true;
            container.width = "100%";
            container.alpha = 0;

            const titleText = new TextBlock();
            titleText.text = `⛋ ${quest.name}`;
            titleText.color = this._isDay ? "black" : "white";
            titleText.fontSize = 20;
            titleText.fontWeight = "bold";
            titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            titleText.height = "40px";

            const stepText = new TextBlock();
            stepText.text = quest.steps[quest.currentStepIndex].description;
            stepText.color = this._isDay ? "black" : "white";
            stepText.fontSize = 17;
            stepText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            stepText.height = "40px";
            stepText.textWrapping = true;
            stepText.paddingLeft = "16px";

            container.addControl(titleText);
            container.addControl(stepText);
            container.addControl(this.createSeparator());

            this._panel.addControl(container);

            // Animation alpha
            const fadeAnim = new Animation(
                "fadeInQuest",
                "alpha",
                60,
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            fadeAnim.setKeys([
                { frame: 0, value: 0 },
                { frame: 20, value: 1 }
            ]);
            container.animations = [fadeAnim];

            setTimeout(() => {
                Game.scene.beginAnimation(container, 0, 20, false);
            }, index * 150);
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
