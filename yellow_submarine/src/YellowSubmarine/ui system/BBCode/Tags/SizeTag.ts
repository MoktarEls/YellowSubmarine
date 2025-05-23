import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class SizeTag extends BBTag {

    onOpen(style: BBStyle): BBStyle {
        const newStyle = {...style};
        const parsedSize = parseInt(this.param || "");

        if(!isNaN(parsedSize)){
            newStyle.size = parsedSize;
        }
        return newStyle;
    }

}