import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";
import { BBTag } from "@/YellowSubmarine/ui system/BBCode/BBTag";
import { ItalicTag } from "@/YellowSubmarine/ui system/BBCode/Tags/ItalicTag";
import { BoldTag } from "@/YellowSubmarine/ui system/BBCode/Tags/BoldTag";
import { ColorTag } from "@/YellowSubmarine/ui system/BBCode/Tags/ColorTag";
import { SizeTag } from "@/YellowSubmarine/ui system/BBCode/Tags/SizeTag";
import { BBContext } from "./BBContext";

interface Segment {
    text: string;
    style: BBStyle;
}

export class BBParser {
    private _registry = new Map<string, new (param?: string) => BBTag>();

    constructor() {
        this.initRegistry();
    }

    private initRegistry(): void {
        this._registry.set("i", ItalicTag);
        this._registry.set("g", BoldTag);
        this._registry.set("c", ColorTag);
        this._registry.set("s", SizeTag);
    }

    public parseBBCode(input: string): Segment[] {
        const segments: Segment[] = [];
        const context = new BBContext();

        let cursor = 0;
        const regex = /\[\/?([a-z]+)(?:=([^\]]+))?\]/ig;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(input))) {
            const [full, name, param] = match;
            const isClosing = full.startsWith("[/");
            const index = match.index;

            if (index > cursor) {
                segments.push({
                    text: input.slice(cursor, index),
                    style: { ...context.currentStyle }
                });
            }

            cursor = index + full.length;
            this.processTag(name, param, isClosing, context);
        }

        if (cursor < input.length) {
            segments.push({
                text: input.slice(cursor),
                style: { ...context.currentStyle }
            });
        }

        return segments;
    }

    private processTag(name: string, param: string | undefined, isClosing: boolean, context: BBContext): void {
        if (!isClosing) {
            const TagClass = this._registry.get(name);
            if (TagClass) {
                const tag = new TagClass(param);
                context.openTag(tag);
            }
        } else {
            context.closeTag();
        }
    }
}
