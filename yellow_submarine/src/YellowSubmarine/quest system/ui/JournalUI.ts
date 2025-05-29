import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, StackPanel, TextBlock} from "@babylonjs/gui";
import {Quest} from "@/YellowSubmarine/quest system/Quest";
import {Game} from "@/YellowSubmarine/Game";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";
import {KeyboardEventTypes} from "@babylonjs/core";
import {MainMenuUI} from "@/YellowSubmarine/ui system/MainMenuUI";

export class JournalUI extends UI{

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
        // StackPanel global centré
        this._panel = new StackPanel();
        this._panel.width = "60%";
        this._panel.height = "80%";
        this._panel.isVertical = true;
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._panel.spacing = 20;
        this._panel.isVisible = false;
        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "j" && state){
                this._panel.isVisible ? this.hide() : this.show();
            }
        });
        JournalUI._instance = this;
    }

    private refresh() {
        if(QuestManager.instance) {
            this._panel.clearControls();
            this._journalEntry.forEach((lines, quest) => {
                const title = new TextBlock();
                title.text = quest.name;
                title.fontSize = "24px";
                title.color = "white";
                title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                title.paddingTop = "10px";
                title.paddingBottom = "5px";
                this._panel.addControl(title);

                lines.forEach(line => {
                    const lineText = new TextBlock();
                    lineText.text = "- " + line;
                    lineText.fontSize = "18px";
                    lineText.color = "white";
                    lineText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                    lineText.height = "30px";
                    this._panel.addControl(lineText);
                });
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
        if(quest){
            if(!this._journalEntry.has(quest)){
                this._journalEntry.set(quest, []);
            }
            this._journalEntry.get(quest)?.push(entry);
        }
        this.refresh();

    }
}