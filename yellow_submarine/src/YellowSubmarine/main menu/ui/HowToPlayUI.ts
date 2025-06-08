import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control} from "@babylonjs/gui";
import {ImageUI} from "@/YellowSubmarine/ui system/custom nodes/ImageUI";

export class HowToPlayUI extends UI {

    private readonly _image: ImageUI;

    get controlNode(): Control {
        return this._image.controlNode;
    }

    constructor() {
        super();
        this._image = new ImageUI("ui/how-to-play.png");
        this.hide();

    }

}