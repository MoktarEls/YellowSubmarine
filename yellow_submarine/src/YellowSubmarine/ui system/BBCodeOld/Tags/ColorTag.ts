import {BBTag} from "@/YellowSubmarine/ui system/BBCodeOld/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCodeOld/BBStyle";

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