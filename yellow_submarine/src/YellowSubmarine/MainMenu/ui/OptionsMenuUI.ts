import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, Slider, StackPanel, TextBlock } from "@babylonjs/gui";
import { Game } from "@/YellowSubmarine/Game";
import { KeyboardEventTypes } from "@babylonjs/core";
import { SoundManager } from "@/YellowSubmarine/sound system/SoundManager";
import {ButtonUI} from "@/YellowSubmarine/ui system/ButtonUI";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";

export class OptionsMenuUI extends UI {

    private _panel: StackPanel;

    get controlNode(): Control {
        return this._panel;
    }

    constructor() {
        super();
        this._panel = new StackPanel();
        this._panel.zIndex = 2;
        this._panel.width = "600px";
        this._panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._panel.spacing = 15;
        this._panel.paddingLeft = "60px";
        this.createSliderWithLabel("Volume SFX", SoundManager.instance.SFXVolume, (value) => {
            SoundManager.instance.SFXVolume = value;
        });

        this.createSliderWithLabel("Volume Musique", SoundManager.instance.MUSICVolume, (value) => {
            SoundManager.instance.MUSICVolume = value;
        });

        this.createSliderWithLabel("Volume UI", SoundManager.instance.UIVolume, (value) => {
            SoundManager.instance.UIVolume = value;
        });


        const buttonStyle = {
            button: {
                width: "60%",
                height: "40px",
                color: "white",
                background: "rgba(255, 255, 255, 0.05)",
                horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
                paddingBottom: "10px",
                fontSize: "28px",
                fontStyle: "bold",
                cornerRadius: 10,
                thickness: 1
            }
        }

        const backButton = new ButtonUI("Retour", () => {
            this.hide()
            UIManager.instance.showUI("mainMenu");
        }, buttonStyle);

        this._panel.addControl(backButton.controlNode);

        this._panel.isVisible = false;

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if (eventData.event.key === "Escape" && state && this.controlNode.isVisible) {
                this.hide();
            }
        });
    }

    private createSliderWithLabel(labelText: string, initialValue: number, onChange: (value: number) => void) {
        const container = new StackPanel();
        container.isVertical = false;
        container.height = "40px";
        container.paddingBottom = "10px";
        container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        const label = new TextBlock();
        label.text = labelText;
        label.color = "white";
        label.width = "120px";
        label.fontSize = 14;
        label.fontStyle = "bold";
        label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        label.paddingRight = "10px";

        const slider = new Slider();
        slider.minimum = 0;
        slider.maximum = 1;
        slider.value = initialValue;
        slider.width = "150px";
        slider.height = "14px";
        slider.color = "#FFF";
        slider.background = "#333";
        slider.thumbWidth = "18px";
        slider.thumbColor = "#AAA";
        slider.borderColor = "#888";

        const valueLabel = new TextBlock();
        valueLabel.text = Math.round(initialValue * 100).toString() + " %";
        valueLabel.width = "50px";
        valueLabel.color = "white";
        valueLabel.fontSize = 14;
        valueLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        valueLabel.paddingLeft = "10px";

        slider.onValueChangedObservable.add((value) => {
            valueLabel.text = Math.round(value * 100).toString() + " %";
            onChange(value);
        });

        container.addControl(label);
        container.addControl(slider);
        container.addControl(valueLabel);

        this._panel.addControl(container);
    }

}