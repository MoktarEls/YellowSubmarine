import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueInteractionUI} from "@/YellowSubmarine/interaction system/ui/DialogueInteractionUI";
import {WorldInteractionUI} from "@/YellowSubmarine/interaction system/ui/WorldInteractionUI";
import {IslandsUI} from "@/YellowSubmarine/interaction system/ui/IslandsUI";
import {MainMenuUI} from "@/YellowSubmarine/ui system/MainMenuUI";
import {OptionsMenuUI} from "@/YellowSubmarine/ui system/OptionsMenuUI";
import {QuestUI} from "@/YellowSubmarine/quest system/ui/QuestUI";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";


export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);

    private _worldInteractionUI: WorldInteractionUI = new WorldInteractionUI();
    private _dialogueInteractionUI: DialogueInteractionUI = new DialogueInteractionUI();
    private _islandsUI: IslandsUI = new IslandsUI();
    private _mainMenuUI: MainMenuUI;
    private _optionsMenuUI;
    private _questUI: QuestUI = new QuestUI();
    private _journalUI: JournalUI = new JournalUI();


    constructor(private _canvas: HTMLCanvasElement) {
        this._ui.addControl(this._worldInteractionUI.controlNode);
        this._ui.addControl(this._dialogueInteractionUI.controlNode);
        this._ui.addControl(this._islandsUI.controlNode);
        this._mainMenuUI = new MainMenuUI();
        this._optionsMenuUI = this._mainMenuUI.optionsMenuUI;
        this._ui.addControl(this._optionsMenuUI.controlNode);
        this._ui.addControl(this._mainMenuUI.controlNode);
        this._mainMenuUI.canvas = _canvas;
        this._ui.addControl(this._questUI.controlNode);
        this._ui.addControl(this._journalUI.controlNode);
    }

    public showMainMenu(): void {
        if(this._mainMenuUI)
            this._mainMenuUI.show();
    }
}