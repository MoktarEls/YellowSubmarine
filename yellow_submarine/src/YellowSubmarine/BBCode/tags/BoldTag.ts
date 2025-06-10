import {TextBlock} from "@babylonjs/gui";
import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";

export class BoldTag extends BBTag {

    apply(tb: TextBlock) {
        tb.fontWeight = 'bold';
    }

}