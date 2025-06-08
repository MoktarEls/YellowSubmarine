import { BBParser } from "@/YellowSubmarine/ui system/BBCodeOld/BBParser";
import { Segment } from "@/YellowSubmarine/ui system/BBCodeOld/Segment";

export class TextFormatter {
    private parser: BBParser;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private defaultFontSize = 24,
        private horizontalPadding = 4
    ) {
        this.parser = new BBParser();
        const canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d")!;
    }

    public format(text: string, maxWidth: number): Segment[][] {
        const segments = this.parser.parseBBCode(text);
        return this.splitLines(segments, maxWidth);
    }

    private getTextWidth(text: string, fontSize: number): number {
        this.ctx.font = `${fontSize}px sans-serif`;
        return this.ctx.measureText(text).width;
    }

    private splitLines(segments: Segment[], maxWidth: number): Segment[][] {
        const lines: Segment[][] = [];
        let currentLine: Segment[] = [];
        let currentWidth = 0;

        for (const segment of segments) {
            const fontSize = segment.style.size as number || this.defaultFontSize;
            const segWidth = this.getTextWidth(segment.text, fontSize) + this.horizontalPadding * 2;

            if (currentWidth + segWidth <= maxWidth) {
                currentLine.push(segment);
                currentWidth += segWidth;
            } else {
                const parts = segment.text.split(/(\s+)/); // split on spaces

                for (const part of parts) {
                    if (part === '' || (part.trim() === '' && currentLine.length === 0)) continue;

                    const partWidth = this.getTextWidth(part, fontSize) + this.horizontalPadding * 2;

                    if (currentWidth + partWidth > maxWidth && currentLine.length) {
                        lines.push(currentLine);
                        currentLine = [];
                        currentWidth = 0;
                        if (part.trim() === '') continue;
                    }

                    currentLine.push({ text: part, style: segment.style });
                    currentWidth += partWidth;
                }
            }
        }

        if (currentLine.length) lines.push(currentLine);
        return lines;
    }
}
