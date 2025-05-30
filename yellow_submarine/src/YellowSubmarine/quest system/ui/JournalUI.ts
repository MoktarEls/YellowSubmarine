import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, StackPanel, TextBlock, Rectangle } from "@babylonjs/gui";
import { Quest } from "@/YellowSubmarine/quest system/Quest";
import { Game } from "@/YellowSubmarine/Game";
import { QuestManager } from "@/YellowSubmarine/quest system/QuestManager";
import { KeyboardEventTypes } from "@babylonjs/core";
import { SoundManager } from "@/YellowSubmarine/sound system/SoundManager";

export class JournalUI extends UI {
    private _panel: StackPanel;
    private _container: StackPanel;
    private _journalEntry: Map<Quest, Array<string>> = new Map();
    private static _instance: JournalUI;
    private hasBeenOpened = false;

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
        this._panel.isVisible = false;

        const containerBg = new Rectangle();
        containerBg.background = "rgba(0, 0, 0, 0.6)";
        containerBg.thickness = 0;
        containerBg.cornerRadius = 10;
        containerBg.height = "100%";
        containerBg.width = "100%";
        containerBg.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        this._container = new StackPanel();
        this._container.isVertical = true;
        this._container.width = "100%";
        this._container.spacing = 20;
        this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        containerBg.addControl(this._container);
        this._panel.addControl(containerBg);

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if (eventData.event.key === "j" && state) {
                this._panel.isVisible ? this.hide() : this.show();
            }
        });

        JournalUI._instance = this;
    }

    private refresh() {
        if (!QuestManager.instance) return;

        this._container.clearControls();

        this._journalEntry.forEach((lines, quest) => {
            const questBlock = new StackPanel();
            questBlock.isVertical = true;
            questBlock.width = "80%";
            questBlock.paddingTop = "10px";
            questBlock.paddingBottom = "10px";
            questBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

            const titleText = new TextBlock();
            titleText.text = `⛋ ${quest.name}`;
            titleText.color = "white";
            titleText.fontSize = 20;
            titleText.fontWeight = "bold";
            titleText.resizeToFit = true;
            titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

            questBlock.addControl(titleText);

            lines.forEach((line) => {
                const entryText = new TextBlock();
                entryText.text = `- ${line}`;
                entryText.color = "#FFFFFF";
                entryText.fontSize = 17;
                entryText.textWrapping = true;
                entryText.resizeToFit = true;
                entryText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

                questBlock.addControl(entryText);
            });

            questBlock.addControl(this.createSeparator());
            this._container.addControl(questBlock);
        });
    }

    private createSeparator(): Rectangle {
        const separator = new Rectangle();
        separator.height = "2px";
        separator.width = "100%";
        separator.background = "#888888";
        separator.thickness = 0;
        separator.paddingTop = "6px";
        return separator;
    }

    public show() {
        this.refresh();
        this._panel.isVisible = true;
        if (!this.hasBeenOpened) {
            QuestManager.instance.getQuest("dreamland")?.updateCurrentStepStatus();
        }
        if (SoundManager.instance) {
            SoundManager.instance.stopSFX("click");
            SoundManager.instance.playSFX("click", { autoplay: true });
        }
        this.hasBeenOpened = true;
    }

    public hide() {
        this._panel.isVisible = false;
        if (SoundManager.instance) {
            SoundManager.instance.stopSFX("click");
            SoundManager.instance.playSFX("click", { autoplay: true });
        }
    }

    public addEntryToQuest(quest: Quest | undefined, entry: string) {
        if (!quest) return;

        if (!this._journalEntry.has(quest)) {
            this._journalEntry.set(quest, []);
        }

        const entries = this._journalEntry.get(quest)!;
        if (!entries.includes(entry)) {
            entries.push(entry);
        }

        this.refresh();
    }
}
