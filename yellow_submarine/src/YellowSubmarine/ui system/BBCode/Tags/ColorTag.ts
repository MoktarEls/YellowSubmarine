import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class ColorTag extends BBTag {
    onOpen(style: BBStyle): BBStyle {
        return {...style, color: this.param || style.color};
    }

    onClose(style: BBStyle): BBStyle {
        const newStyle = { ...style };
        delete newStyle.color;
        return newStyle;
    }

}