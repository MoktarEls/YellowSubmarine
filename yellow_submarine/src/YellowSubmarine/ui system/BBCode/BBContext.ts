import { BBTag } from "@/YellowSubmarine/ui system/BBCode/BBTag";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class BBContext {
    private tagStack: BBTag[] = [];
    private styleStack: BBStyle[] = [];
    private _currentStyle: BBStyle = {};

    get currentStyle(): BBStyle {
        return this._currentStyle;
    }

    openTag(tag: BBTag): void {
        this.tagStack.push(tag);
        this.styleStack.push({ ...this._currentStyle });
        this._currentStyle = tag.onOpen(this._currentStyle);
    }

    closeTag(): void {
        const tag = this.tagStack.pop();
        const previousStyle = this.styleStack.pop();
        if (tag && previousStyle) {
            this._currentStyle = tag.onClose(previousStyle);
        }
    }
}
