import {UI} from "@/YellowSubmarine/ui system/UI";
import {
    Button,
    Control,
    StackPanel,
    TextBlock
} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes} from "@babylonjs/core";
import {OptionsMenuUI} from "@/YellowSubmarine/ui system/OptionsMenuUI";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";
import {ImageUI} from "@/YellowSubmarine/ui system/ImageUI";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";

export class MainMenuUI extends UI {

    private _panel: StackPanel;
    private _optionMenuUI : OptionsMenuUI;
    private _canvas?: HTMLCanvasElement;
    private _howToPlay: ImageUI;

    public set canvas(canvas : HTMLCanvasElement) {
        this._canvas = canvas;
    }

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

        const playButton = MainMenuUI.createButton("Jouer", () => this.onPlayPressed());
        const optionsButton = MainMenuUI.createButton("Options", () => this.onOptionsPressed());
        const howToPlayButton = MainMenuUI.createButton("How to Play", () => this.showHowToPlay());
        const quitButton = MainMenuUI.createButton("Quitter", () => this.onQuitPressed());

        this._panel.addControl(playButton);
        this._panel.addControl(optionsButton);
        this._panel.addControl(howToPlayButton);
        //this._panel.addControl(quitButton);

        this.show();

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "Escape" && state && !this.optionsMenuUI.controlNode.isVisible){
                if(this._canvas && !this._panel.isVisible){
                    this.show();
                }
            }
            if(eventData.event.key === "Escape" && state && this._howToPlay.controlNode.isVisible){
                if(this._canvas){
                    this.hideHowToPlay();
                    this.show();
                }
            }
        });
    }

    public static createButton(text: string, callback: () => void): Button {
        const button = Button.CreateSimpleButton(text.toLowerCase(), text);
        button.width = "100%";
        button.height = "60px";
        button.color = "white";
        button.background = "rgba(255, 255, 255, 0.05)";
        button.fontSize = "28px";
        button.fontStyle = "bold";
        button.textBlock!.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.textBlock!.paddingLeft = "20px";
        button.cornerRadius = 10;
        button.thickness = 1;
        button.paddingBottom = "10px";

        button.onPointerEnterObservable.add(() => {
            button.background = "rgba(255, 255, 255, 0.2)";
        });
        button.onPointerOutObservable.add(() => {
            button.background = "rgba(255, 255, 255, 0.05)";
        });

        button.onPointerUpObservable.add(callback);
        button.onPointerUpObservable.add(() => {
            if (SoundManager.instance) {
                SoundManager.instance.stopUI("click");
                SoundManager.instance.playUI("click", {autoplay: true, loop: false});
            }
        });
        return button;
    }

    public show() {
        this._panel.isVisible = true;
    }

    public hide() {
        this._panel.isVisible = false;
    }

    private onPlayPressed() {
        if(this._canvas) {
            this._canvas.requestPointerLock();
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