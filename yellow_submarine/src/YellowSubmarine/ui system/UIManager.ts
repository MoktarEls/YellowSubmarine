import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueInteractionUI} from "@/YellowSubmarine/interaction system/ui/DialogueInteractionUI";
import {WorldInteractionUI} from "@/YellowSubmarine/interaction system/ui/WorldInteractionUI";
import {IslandsUI} from "@/YellowSubmarine/interaction system/ui/IslandsUI";


export class UIManager {

    private static _instance : UIManager;

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);

    private _worldInteractionUI: WorldInteractionUI = new WorldInteractionUI();
    private _dialogueInteractionUI: DialogueInteractionUI = new DialogueInteractionUI();
    private _islandsUI: IslandsUI = new IslandsUI();

    constructor() {
        UIManager._instance = this;
        this._ui.addControl(this._worldInteractionUI.controlNode);
        this._ui.addControl(this._dialogueInteractionUI.controlNode);
        this._ui.addControl(this._islandsUI.controlNode);
    }

    public static get instance(): UIManager {
        return this._instance;
    }

    public get islandUI(): IslandsUI {
        return this._islandsUI;
    }

}