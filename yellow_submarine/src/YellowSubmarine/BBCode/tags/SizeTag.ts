import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class SizeTag extends BBTag {

    get size(): number {
        return this._size;
    }

    constructor(private _size: number) {
        super();
    }

    apply(tb: TextBlock) {
        tb.fontSizeInPixels = this._size;
    }
}