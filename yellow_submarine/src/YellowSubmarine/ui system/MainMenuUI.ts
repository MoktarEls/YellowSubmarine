import {UI} from "@/YellowSubmarine/ui system/UI";
import {
    Control,
    StackPanel,
} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes} from "@babylonjs/core";
import {OptionsMenuUI} from "@/YellowSubmarine/ui system/OptionsMenuUI";
import {ImageUI} from "@/YellowSubmarine/ui system/ImageUI";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {ButtonUI} from "@/YellowSubmarine/ui system/ButtonUI";

export class MainMenuUI extends UI {

    private _panel: StackPanel;
    private _optionMenuUI : OptionsMenuUI;
    private _howToPlay: ImageUI;


    public get controlNode(): Control {
        return this._panel;
    }

    public get optionsMenuUI(): OptionsMenuUI {
        return this._optionMenuUI;
    }

    constructor() {
        super();

        this._howToPlay = new ImageUI("ui/how-to-play.png");
        this._howToPlay.controlNode.isVisible = false;
        this._optionMenuUI = new OptionsMenuUI(this);

        this._panel = new StackPanel();
        this._panel.zIndex = 2;
        this._panel.width = "300px";
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._panel.paddingLeft = "60px";
        this._panel.spacing = 20;

        const playButton = new ButtonUI("Jouer", () => this.onPlayPressed(), {
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            paddingBottom: "10px"
        });
        const optionsButton = new ButtonUI("Options", () => this.onOptionsPressed(), {
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            paddingBottom: "10px"
        });
        const howToPlayButton = new ButtonUI("How to Play", () => this.showHowToPlay(), {
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            paddingBottom: "10px"
        });

        playButton.addTextPaddingLeft(20);
        optionsButton.addTextPaddingLeft(20);
        howToPlayButton.addTextPaddingLeft(20);

        this._panel.addControl(playButton.controlNode);
        this._panel.addControl(optionsButton.controlNode);
        this._panel.addControl(howToPlayButton.controlNode);

        this.show();

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "Escape" && state && !this.optionsMenuUI.controlNode.isVisible){
                if(UIManager.instance.canvas && !this._panel.isVisible){
                    this.show();
                }
            }
            if(eventData.event.key === "Escape" && state && this._howToPlay.controlNode.isVisible){
                if(UIManager.instance.canvas){
                    this.hideHowToPlay();
                    this.show();
                }
            }
        });
    }

    public show() {
        this._panel.isVisible = true;
    }

    public hide() {
        this._panel.isVisible = false;
    }

    private onPlayPressed() {
        if(UIManager.instance.canvas) {
            UIManager.instance.canvas.requestPointerLock();
            this.hide();
        }
    }

    private onOptionsPressed() {
        this._optionMenuUI.show();
        this.hide();
    }

    private onQuitPressed() {
        console.log("Quitter !");
    }

    private showHowToPlay(): void {
        this.hide();
        this._howToPlay.controlNode.isVisible = true;
        UIManager.instance.ui.addControl(this._howToPlay.controlNode);
    }

    private hideHowToPlay(): void {
        this._howToPlay.controlNode.isVisible = false;
        UIManager.instance.ui.removeControl(this._howToPlay.controlNode);
    }
}