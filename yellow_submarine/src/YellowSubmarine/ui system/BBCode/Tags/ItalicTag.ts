import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class ItalicTag extends BBTag {
    onOpen(style: BBStyle): BBStyle {
        return {...style, italic: true};
    }

    onClose(style: BBStyle): BBStyle {
        const newStyle = { ...style };
        delete newStyle.italic;
        return newStyle;
    }
}