import {Button, Control} from "@babylonjs/gui";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";

export class ButtonUI extends UI {

    private _button: Button;

    constructor(label: string, onClick: () => void, config?: Partial<Button>) {
        super();

        this._button = Button.CreateSimpleButton(label.toLowerCase(), label);

        this._button.width = config?.width ?? "100%";
        this._button.height = config?.height ?? "60px";
        this._button.color = config?.color ?? "white";
        this._button.background = config?.background ?? "rgba(255, 255, 255, 0.05)";

        this._button.paddingTop = config?.paddingTop ?? "0px";
        this._button.paddingBottom = config?.paddingBottom ?? "0px";
        this._button.paddingLeft = config?.paddingLeft ?? "0px";
        this._button.paddingRight = config?.paddingRight ?? "0px";

        this._button.textBlock!.textHorizontalAlignment = config?.horizontalAlignment ?? Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._button.textBlock!.textVerticalAlignment = config?.verticalAlignment ?? Control.VERTICAL_ALIGNMENT_CENTER;


        this._button.fontSize = "28px";
        this._button.fontStyle = "bold";
        this._button.cornerRadius = 10;
        this._button.thickness = 1;


        this._button.onPointerEnterObservable.add(() => {
            this._button.background = "rgba(255, 255, 255, 0.2)";
        });
        this._button.onPointerOutObservable.add(() => {
            this._button.background = "rgba(255, 255, 255, 0.05)";
        });

        this._button.onPointerUpObservable.add(() => {
            onClick();
            SoundManager.instance?.stopUI("click");
            SoundManager.instance?.playUI("click", { autoplay: true, loop: false });
        });
    }

    public get controlNode(): Control {
        return this._button;
    }

    public setText(text: string) {
        this._button.textBlock!.text = text;
    }

    public show() {
        this._button.isVisible = true;
    }

    public hide() {
        this._button.isVisible = false;
    }

    public addTextPaddingTop(value: number) {
        this._button.textBlock!.paddingTop = `${value}px`;
    }

    public addTextPaddingBottom(value: number) {
        this._button.textBlock!.paddingBottom = `${value}px`;
    }

    public addTextPaddingLeft(value: number) {
        this._button.textBlock!.paddingLeft = `${value}px`;
    }

    public addTextPaddingRight(value: number) {
        this._button.textBlock!.paddingRight = `${value}px`;
    }
}
