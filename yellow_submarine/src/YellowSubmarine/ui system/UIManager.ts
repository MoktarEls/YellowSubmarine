import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueInteractionUI} from "@/YellowSubmarine/dialogue system/ui/DialogueInteractionUI";
import {WorldInteractionUI} from "@/YellowSubmarine/world interaction system/ui/WorldInteractionUI";
import {ShowKeyZoneNameUI} from "@/YellowSubmarine/keyzone system/ui/ShowKeyZoneNameUI";
import {MainMenuUI} from "@/YellowSubmarine/ui system/MainMenuUI";
import {OptionsMenuUI} from "@/YellowSubmarine/ui system/OptionsMenuUI";
import {QuestUI} from "@/YellowSubmarine/quest system/ui/QuestUI";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";
import {ShowConversationProviderUI} from "@/YellowSubmarine/keyzone system/ui/ShowConversationProviderUI";
import {SlideAnimationUI} from "@/YellowSubmarine/ui system/SlideAnimationUI";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {ImageUI} from "@/YellowSubmarine/ui system/ImageUI";


export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);

    private _worldInteractionUI: WorldInteractionUI = new WorldInteractionUI();
    private _dialogueInteractionUI: DialogueInteractionUI = new DialogueInteractionUI();
    private _showConversationProviderUI: ShowConversationProviderUI = new ShowConversationProviderUI();
    private _islandsUI: ShowKeyZoneNameUI = new ShowKeyZoneNameUI();
    private _mainMenuUI: MainMenuUI;
    private _optionsMenuUI;
    private _questUI: QuestUI = new QuestUI();
    private _journalUI: JournalUI = new JournalUI();
    private _slideAnimationUI: SlideAnimationUI;

    private static _instance: UIManager;

    public static get instance(): UIManager {
        return this._instance;
    }

    constructor(private _canvas: HTMLCanvasElement) {
        UIManager._instance = this;
        this._ui.addControl(this._worldInteractionUI.controlNode);
        this._ui.addControl(this._showConversationProviderUI.controlNode);
        this._ui.addControl(this._dialogueInteractionUI.controlNode);
        this._ui.addControl(this._islandsUI.controlNode);
        this._mainMenuUI = new MainMenuUI();
        this._optionsMenuUI = this._mainMenuUI.optionsMenuUI;
        this._ui.addControl(this._optionsMenuUI.controlNode);
        this._ui.addControl(this._mainMenuUI.controlNode);
        this._mainMenuUI.canvas = _canvas;
        this._ui.addControl(this._questUI.controlNode);
        this._ui.addControl(this._journalUI.controlNode);
        this._slideAnimationUI = new SlideAnimationUI();
    }

    public get ui(): AdvancedDynamicTexture {
        return this._ui;
    }

    public showMainMenu(): void {
        if(this._mainMenuUI)
            this._mainMenuUI.show();
    }
}