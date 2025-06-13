import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class DefaultStyleTag extends BBTag{

    apply(tb: TextBlock): void {
        tb.color = "black";
    }

}