import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class ColorTag extends BBTag {

    constructor(private _color: string) {
        super();
    }

    apply(tb: TextBlock) {
        tb.color = this._color;
    }

}