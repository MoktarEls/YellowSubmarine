import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {TextBlock} from "@babylonjs/gui";

export class NullTag extends BBTag{

    apply(tb: TextBlock): void {
        return;
    }

}