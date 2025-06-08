import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class BoldTag extends BBTag {

    apply(tb: TextBlock) {
        tb.fontWeight = 'bold';
    }

}