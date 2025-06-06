import {Button, Control, TextBlock} from "@babylonjs/gui";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";

type ButtonUIConfig = {
    button?: Partial<Button>;
    text?: Partial<TextBlock>;
}

export class ButtonUI extends UI {

    private _button: Button;

    constructor(label: string, onClick: () => void, config?: ButtonUIConfig) {
        super();

        this._button = Button.CreateSimpleButton(label.toLowerCase(), label);

        Object.assign(this._button, config?.button);

        if(this._button.textBlock && config?.text){
            Object.assign(this._button.textBlock, config?.text);
        }

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

}
