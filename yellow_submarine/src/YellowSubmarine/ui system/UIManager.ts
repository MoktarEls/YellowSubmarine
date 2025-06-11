import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueUI} from "@/YellowSubmarine/dialogue system/ui/DialogueUI";
import {WorldInteractionUI} from "@/YellowSubmarine/world interaction system/ui/WorldInteractionUI";
import {ShowKeyZoneNameUI} from "@/YellowSubmarine/keyzone system/ui/ShowKeyZoneNameUI";
import {MainMenuUI} from "@/YellowSubmarine/main menu/ui/MainMenuUI";
import {QuestUI} from "@/YellowSubmarine/quest system/ui/QuestUI";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";
import {ShowConversationProviderUI} from "@/YellowSubmarine/keyzone system/ui/ShowConversationProviderUI";
import {SlideAnimationUI} from "@/YellowSubmarine/ui system/custom nodes/SlideAnimationUI";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {OptionsMenuUI} from "@/YellowSubmarine/main menu/ui/OptionsMenuUI";
import {HowToPlayUI} from "@/YellowSubmarine/main menu/ui/HowToPlayUI";

type UiConstructor = new() => UI;

export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);
    private _canvas: HTMLCanvasElement;

    private _uiMap:Map<string, UI> = new Map();
    private _definitions: Record<string, UiConstructor> = {

        mainMenu: MainMenuUI,
        optionsMenu: OptionsMenuUI,
        howToPlay: HowToPlayUI,
        slideAnimation: SlideAnimationUI,

        showConversationProvider: ShowConversationProviderUI,
        island: ShowKeyZoneNameUI,

        dialogueInteraction: DialogueUI,
        worldInteraction: WorldInteractionUI,

        quest: QuestUI,
        journal: JournalUI,
    }

    private static _instance: UIManager;
    public static get canvasRenderingContext2D(){
        return this._instance._ui.getContext();
    }

    public static get instance(): UIManager {
        return this._instance;
    }

    public get ui(): AdvancedDynamicTexture {
        return this._ui;
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    constructor(canvas: HTMLCanvasElement) {
        UIManager._instance = this;
        this._canvas = canvas;

        for(const [name, UIConstructor] of Object.entries(this._definitions)) {
            const instance = new UIConstructor;
            this._uiMap.set(name, instance);
            this.ui.addControl(instance.controlNode);
        }
    }

    public get(name: string): UI | undefined{
        return this._uiMap.get(name);
    }

    public showUI(name: string): void {
        this.get(name)?.show();
    }

    public hideUI(name: string): void {
        this.get(name)?.hide();
    }

    public isVisible(name: string): boolean {
        return <boolean> this.get(name)?.controlNode.isVisible;
    }

}