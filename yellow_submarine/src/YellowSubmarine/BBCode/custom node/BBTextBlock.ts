import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {Segment} from "@/YellowSubmarine/ui system/BBCodeOld/Segment";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {Game} from "@/YellowSubmarine/Game";

export class BBTextBlock extends UI{

    private _rectangle: Rectangle = new Rectangle();

    private _stackPanels: StackPanel[] = [];
    private _textBlocks: TextBlock[] = [];
    private _heightInPixels = 0;

    get controlNode(): Control {
        return this._rectangle;
    }

    constructor(private _bbtext: BBText) {
        super();
        const segmentsLine = this.calculateSegmentsLine();
        const textBlockLines = this.createTextBlocksLine(segmentsLine);
        this.createStackPanels(textBlockLines);
        this._rectangle.heightInPixels = this._heightInPixels;
        // TODO: écouter l'event de change de taille du rectangle et réorganiser
    }


    private createTextBlocksLine(segments: BBSegment[][]): TextBlock[][] {
        const textBlockLines: TextBlock[][] = [];
        segments.forEach((segmentLine) => {
            const currentTextBlockLine: TextBlock[] = [];
            segmentLine.forEach((segment) => {
                const textBlock = new TextBlock();
                textBlock.textWrapping = false;
                textBlock.resizeToFit = true;
                textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                textBlock.text = segment.text;
                segment.style.tags.forEach(
                    tag => tag.apply(textBlock)
                );
                currentTextBlockLine.push(textBlock);
                this._textBlocks.push(textBlock);
            })
            textBlockLines.push(currentTextBlockLine);
        })
        return textBlockLines;
    }

    private calculateSegmentsLine(): BBSegment[][]{
        const maxWidth = this._rectangle.widthInPixels;
        const lines: BBSegment[][] = [];
        let currentLine: BBSegment[] = [];
        let currentWidth = 0;

        for (const segment of this._bbtext.segments) {
            const fontSize = segment.fontSize;
            const segWidth = this.getTextWidth(segment.text, fontSize);

            if (currentWidth + segWidth <= maxWidth) {
                currentLine.push(segment);
                currentWidth += segWidth;
            } else {
                // TODO : Optimiser pour faire moins de BBSegment
                const parts = segment.text.split(/(\s+)/); // split on spaces

                for (const part of parts) {
                    if (part.trim() === "") continue;

                    const partWidth = this.getTextWidth(part, fontSize);
                    if(currentWidth + partWidth < maxWidth) {
                        currentLine.push(new BBSegment(part, segment.style));
                        currentWidth += partWidth;
                    }
                    else{
                        lines.push(currentLine);
                        currentLine = [new BBSegment(part, segment.style)];
                        currentWidth = partWidth;
                    }

                }
            }
        }

        if (currentLine.length) lines.push(currentLine);
        return lines;
    }

    private createStackPanels(textBlockLines: TextBlock[][]) {
        textBlockLines.forEach((line) => {
            const stackPanel = new StackPanel();
            const stackPanelHeight = Math.max(...line.map( textBlock => textBlock.heightInPixels)) * 1.2;
            stackPanel.heightInPixels = stackPanelHeight;
            stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            stackPanel.isVertical = false;
            line.forEach((textBlock) => {
                stackPanel.addControl(textBlock);
            })
            this._stackPanels.push(stackPanel);
            this._rectangle.addControl(stackPanel);
            this._heightInPixels += stackPanelHeight;
        })
    }

    private getTextWidth(text: string, fontSize: number): number {
        const ctx = Game.canvas.getContext("2d");
        if(ctx){
            ctx.font = `${fontSize}px sans-serif`;
            return ctx.measureText(text).width;
        }
        else{
            throw new Error("Impossible to calculate text width");
        }
    }

}