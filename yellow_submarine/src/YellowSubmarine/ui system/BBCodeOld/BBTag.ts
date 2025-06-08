import { BBStyle } from "@/YellowSubmarine/ui system/BBCodeOld/BBStyle";

export abstract class BBTag {
    constructor(public param?: string) {}

    public abstract onOpen(style: BBStyle): BBStyle;

    public onClose(style: BBStyle): BBStyle {
        return style;
    }
}
