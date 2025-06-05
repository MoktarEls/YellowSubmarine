import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class BoldTag extends BBTag {
    onOpen(style: BBStyle): BBStyle {
        return {...style, bold: true};
    }

    onClose(style: BBStyle): BBStyle {
        const newStyle = { ...style };
        delete newStyle.bold;
        return newStyle;
    }

}