import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Container, Control, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {World} from "@/YellowSubmarine/World";
import {KeyUI} from "@/YellowSubmarine/interaction system/ui/KeyUI";

export class WorldInteractionUI extends UI{

    private _hContainer: StackPanel;
    private _worldInteractionUiContainer: StackPanel;
    private _inputsUiContainer: StackPanel;

    private _selectNextUi: KeyUI;
    private _selectUi: KeyUI;
    private _selectPreviousUi: KeyUI;

    public get controlNode(): Control {
        return this._hContainer;
    }

    constructor() {
        super();
        this._hContainer = new StackPanel();
        this._hContainer.isVertical = false;
        this._hContainer.height = "5%"

        this._worldInteractionUiContainer = new StackPanel();
        this._worldInteractionUiContainer.isVertical = true;
        this._worldInteractionUiContainer.width = "80%"
        this._hContainer.addControl(this._worldInteractionUiContainer);

        this._inputsUiContainer = new StackPanel();
        this._inputsUiContainer.isVertical = true;
        this._inputsUiContainer.width = "20%";
        this._hContainer.addControl(this._inputsUiContainer);

        this._selectNextUi = new KeyUI("🖱️▲");
        this._selectUi = new KeyUI(WorldInteraction.simplifiedCode);
        this._selectPreviousUi = new KeyUI("🖱️▼");

        this._inputsUiContainer.addControl(this._selectNextUi.controlNode);
        this._inputsUiContainer.addControl(this._selectUi.controlNode);
        this._inputsUiContainer.addControl(this._selectPreviousUi.controlNode);
    }

    private show(): void {
        this._hContainer.isVisible = true;
    }

    private hide() {
        this._hContainer.isVisible = false;
    }
}