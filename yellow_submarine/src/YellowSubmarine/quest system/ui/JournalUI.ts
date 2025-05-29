import { UI } from "@/YellowSubmarine/ui system/UI";
import {Control, StackPanel, TextBlock, Rectangle, Grid} from "@babylonjs/gui";
import { Quest } from "@/YellowSubmarine/quest system/Quest";
import { Game } from "@/YellowSubmarine/Game";
import { QuestManager } from "@/YellowSubmarine/quest system/QuestManager";
import { KeyboardEventTypes } from "@babylonjs/core";

export class JournalUI extends UI {
    private _panel: StackPanel;
    private _journalEntry: Map<Quest, Array<string>> = new Map();
    private static _instance: JournalUI;

    public static get instance(): JournalUI {
        return this._instance;
    }

    get controlNode(): Control {
        return this._panel;
    }

    constructor() {
        super();

        this._panel = new StackPanel();
        this._panel.width = "60%";
        this._panel.height = "90%";
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._panel.spacing = 20;
        this._panel.isVisible = false;

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if (eventData.event.key === "j" && state) {
                this._panel.isVisible ? this.hide() : this.show();
            }
        });

        JournalUI._instance = this;
    }

    private refresh() {
        if (QuestManager.instance) {
            this._panel.clearControls();

            this._journalEntry.forEach((lines, quest) => {
                const container = new Rectangle();
                container.background = "rgba(0, 0, 0, 0.4)";
                container.thickness = 0;
                container.cornerRadius = 10;
                container.height = "100%";
                container.paddingBottom = "5px";
                container.width = "100%";
                container.paddingLeft = "10px";
                container.paddingRight = "10px";
                container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

                const questGrid = new Grid();
                questGrid.height = "100%";
                questGrid.addColumnDefinition(0.4);
                questGrid.addColumnDefinition(0.6);
                questGrid.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
                questGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
                questGrid.paddingBottom = "5px";
                questGrid.width = "100%";

                const titleText = new TextBlock();
                titleText.text = "\n" + `🧭 ${quest.name}`;
                titleText.color = "white";
                titleText.fontSize = 20;
                titleText.fontWeight = "bold";
                titleText.paddingLeft = "10px";
                titleText.paddingRight = "10px";
                titleText.paddingTop = "10px"
                titleText.paddingBottom = "10px";
                titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                titleText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

                const stepText = new TextBlock();
                lines.forEach((line) => {
                    stepText.text += "\n" + line + "\n";
                })
                stepText.color = "lightgray";
                stepText.fontSize = 20;
                stepText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                stepText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
                stepText.textWrapping = true;
                stepText.paddingLeft = "10px";
                stepText.paddingRight = "10px";
                stepText.paddingTop = "10px";
                stepText.paddingBottom = "10px";
                questGrid.addControl(titleText, 0, 0); // ligne 0, colonne 0
                questGrid.addControl(stepText, 0, 1);
                container.addControl(questGrid);
                this._panel.addControl(container);
            });
        }
    }

    public show() {
        this._panel.isVisible = true;
    }

    public hide() {
        this._panel.isVisible = false;
    }

    public addEntryToQuest(quest: Quest | undefined, entry: string) {
        if (quest) {
            if (!this._journalEntry.has(quest)) {
                this._journalEntry.set(quest, []);
            }
            if(!this._journalEntry.get(quest)?.includes(entry)) this._journalEntry.get(quest)?.push(entry);
        }
        this.refresh();
    }
}
