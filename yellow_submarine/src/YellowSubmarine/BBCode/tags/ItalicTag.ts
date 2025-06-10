import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class ItalicTag extends BBTag {
    apply(tb: TextBlock) {
        tb.fontWeight = 'italic';
    }
}