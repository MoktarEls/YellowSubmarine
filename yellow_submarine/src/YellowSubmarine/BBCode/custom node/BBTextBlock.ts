import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {Segment} from "@/YellowSubmarine/ui system/BBCodeOld/Segment";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";

export class BBTextBlock extends UI{

    private _rectangle: Rectangle = new Rectangle();

    private _stackPanelLines: StackPanel[] = [];
    private _textBlocks: TextBlock[] = [];
    private _segmentToBlock: Map<BBSegment, TextBlock> = new Map();

    get controlNode(): Control {
        return this._rectangle;
    }

    constructor(private _bbtext: BBText) {
        super();
        this.createTextBlocks();
        this.reorganiseOnResize();
    }


    private createTextBlocks() {
        this._bbtext.segments.forEach((segment) => {
            const textBlock = new TextBlock();
            textBlock.textWrapping = false;
            textBlock.resizeToFit = true;
            textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            textBlock.text = segment.text;
            segment.style.tags.forEach(
                tag => tag.apply(textBlock)
            );
            this._textBlocks.push(textBlock);
            this._segmentToBlock.set(segment, textBlock);
        })
    }

    private organiseTextBlocks(): TextBlock[][]{
        const maxWidth = this._rectangle.width;
        const lines: BBSegment[][] = [];
        let currentLine: BBSegment[] = [];
        let currentWidth = 0;

        for (const segment of this._bbtext.segments) {
            const fontSize = segment.textSize;
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

    private getTextWidth(text: string, fontSize: number): number {
        this.ctx.font = `${fontSize}px sans-serif`;
        return this.ctx.measureText(text).width;
    }
}