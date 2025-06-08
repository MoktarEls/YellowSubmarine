import {BBTag} from "@/YellowSubmarine/ui system/BBCodeOld/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCodeOld/BBStyle";

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