import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";
import {BBTag} from "@/YellowSubmarine/ui system/BBCode/BBTag";
import {ItalicTag} from "@/YellowSubmarine/ui system/BBCode/ItalicTag";
import {BoldTag} from "@/YellowSubmarine/ui system/BBCode/BoldTag";
import {ColorTag} from "@/YellowSubmarine/ui system/BBCode/ColorTag";

interface Segment { text: string; style: BBStyle; }

export class BBParser {

    private _registry = new Map<string, new (param?: string) => BBTag>();

    constructor() {
        this.initRegistry();
    }

    private initRegistry(): void{
        this._registry.set("i", ItalicTag);
        this._registry.set("g", BoldTag);
        this._registry.set("c", ColorTag);
    }

    public parseBBCode(input: string): Segment[] {
        const segments: Segment[] = [];
        const tagStack: BBTag[] = [];
        const styleStack: BBStyle[] = [];

        let cursor = 0;
        let currentStyle: BBStyle = {};

        const regex = /\[\/?([a-z]+)(?:=([^\]]+))?\]/ig;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(input))) {
            const [full, name, param] = match;
            const isClosing = full.startsWith("[/");
            const idx = match.index;

            // 1) Texte avant le tag
            if (idx > cursor) {
                segments.push({ text: input.slice(cursor, idx), style: { ...currentStyle } });
            }
            cursor = idx + full.length;

            if (!isClosing) {
                const TagClass = this._registry.get(name);
                if (TagClass) {
                    const tagInstance = new TagClass(param);
                    tagStack.push(tagInstance);
                    styleStack.push({ ...currentStyle }); // snapshot du style
                    currentStyle = tagInstance.onOpen(currentStyle);
                }
            } else {
                const last = tagStack.pop();
                const previousStyle = styleStack.pop();
                if (last && previousStyle) {
                    currentStyle = previousStyle; // restore snapshot
                }
            }
        }

        if (cursor < input.length) {
            segments.push({ text: input.slice(cursor), style: { ...currentStyle } });
        }

        return segments;
    }


}