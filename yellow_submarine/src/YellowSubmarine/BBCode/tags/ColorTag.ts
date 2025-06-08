import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class ColorTag extends BBTag {

    get color(): string {
        return this._color;
    }

    constructor(private _color: string) {
        super();
    }

    apply(tb: TextBlock) {
        tb.color = this._color;
    }

}