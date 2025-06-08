import {BBTag} from "@/YellowSubmarine/ui system/BBCodeOld/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCodeOld/BBStyle";

export class SizeTag extends BBTag {

    onOpen(style: BBStyle): BBStyle {
        const newStyle = {...style};
        const parsedSize = parseInt(this.param || "");

        if(!isNaN(parsedSize)){
            newStyle.size = parsedSize;
        }
        return newStyle;
    }

    onClose(style: BBStyle): BBStyle {
        const newStyle = { ...style };
        delete newStyle.size;
        return newStyle;
    }

}