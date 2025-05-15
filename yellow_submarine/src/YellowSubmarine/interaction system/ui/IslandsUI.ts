import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock} from "@babylonjs/gui";
import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";

export class IslandsUI extends UI{

    private _textBlock: TextBlock;

    get controlNode(): Control {
        return this._textBlock;
    }

    constructor() {
        super();
        this._textBlock = new TextBlock();
        KeyZone.onAnyKeyZoneEntered.add((keyzone) => this.show(keyzone))
    }

    public show(keyzone: KeyZone) {

        this._textBlock.isVisible = true;
        this._textBlock.text = keyzone.name;

        if(keyzone.discovered) {
            this._textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            this._textBlock.paddingLeft = "20px";
            this._textBlock.paddingBottom = "20px";
            this._textBlock.color = "white";
            this._textBlock.fontSize = "24px";
            this._textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        } else {
            this._textBlock.color = "white";
            this._textBlock.fontSize = "48px";
            this._textBlock.fontStyle = "bold";
            this._textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            this._textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            this._textBlock.paddingTop = "30px";
        }

        setTimeout(() => {
            this._textBlock.isVisible = false;
        }, 3000);
    }




}