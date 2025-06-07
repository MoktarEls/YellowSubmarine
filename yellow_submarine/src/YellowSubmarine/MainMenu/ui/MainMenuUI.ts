import {UI} from "@/YellowSubmarine/ui system/UI";
import {
    Control,
    StackPanel,
} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes} from "@babylonjs/core";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {ButtonUI} from "@/YellowSubmarine/ui system/ButtonUI";

export class MainMenuUI extends UI {

    private readonly _panel: StackPanel;

    public get controlNode(): Control {
        return this._panel;
    }

    constructor() {
        super();

        this._panel = new StackPanel();
        this._panel.zIndex = 2;
        this._panel.width = "300px";
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._panel.paddingLeft = "60px";
        this._panel.spacing = 20;

        const buttonStyle = {
            button: {
                width: "100%",
                height: "60px",
                color: "white",
                background: "rgba(255, 255, 255, 0.05)",
                horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
                paddingBottom: "10px",
                fontSize: "28px",
                fontStyle: "bold",
                cornerRadius: 10,
                thickness: 1
            },
            text: {
                textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
                paddingLeft: "20px",
            }
        }

        const playButton = new ButtonUI("Jouer", () => this.onPlayPressed(), buttonStyle);
        const optionsButton = new ButtonUI("Options", () => this.onOptionsPressed(), buttonStyle);
        const howToPlayButton = new ButtonUI("How to Play", () => this.onHowToPressed(), buttonStyle);

        this._panel.addControl(playButton.controlNode);
        this._panel.addControl(optionsButton.controlNode);
        this._panel.addControl(howToPlayButton.controlNode);

        this.show();

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "Escape" && state && UIManager.instance.isVisible("optionsMenu")){
                if(UIManager.instance.canvas){
                    UIManager.instance.hideUI("optionsMenu");
                    this.show();
                }
            }
            if(eventData.event.key === "Escape" && state && UIManager.instance.isVisible("howToPlay")){
                if(UIManager.instance.canvas){
                    UIManager.instance.hideUI("howToPlay");
                    this.show();
                }
            }
        });
    }

    private onPlayPressed() {
        if(UIManager.instance.canvas) {
            UIManager.instance.canvas.requestPointerLock();
            this.hide();
        }
    }

    private onOptionsPressed() {
        this.hide();
        UIManager.instance.showUI("optionsMenu");
    }

    private onHowToPressed(): void {
        this.hide();
        UIManager.instance.showUI("howToPlay");
    }

}