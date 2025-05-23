import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class ItalicTag extends BBTag {
    onOpen(style: BBStyle): BBStyle {
        return {...style, italic: true};
    }
}