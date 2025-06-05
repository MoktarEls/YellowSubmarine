import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Rectangle, TextBlock} from "@babylonjs/gui";

export class KeyUI extends UI{

    private _rectangle: Rectangle;
    private _textBlock: TextBlock;

    constructor(private _simplifiedCode: string) {
        super();
        this._rectangle = new Rectangle();
        this._rectangle.width = "80px";
        this._rectangle.height = "70px";
        this._rectangle.cornerRadius = 60;
        this._rectangle.color = "rgb(168, 98, 68)";
        this._rectangle.thickness = 4;
        this._rectangle.background = "rgb(255, 255, 255)";

        this._textBlock = new TextBlock();
        this._textBlock.fontSize = 45;
        this._textBlock.text = `${_simplifiedCode}`;
        this._textBlock.fontWeight = "bold";
        this._textBlock.paddingTop = "6px";
        this._rectangle.addControl(this._textBlock);

    }

    get controlNode(): Control {
        return this._rectangle;
    }

}