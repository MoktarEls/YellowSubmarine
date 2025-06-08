import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class SizeTag extends BBTag {

    constructor(private _size: number) {
        super();
    }

    apply(tb: TextBlock) {
        tb.fontSize = this._size;
    }
}