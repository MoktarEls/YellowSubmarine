import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, StackPanel, TextBlock} from "@babylonjs/gui";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {Game} from "@/YellowSubmarine/Game";

export class BBTextBlock extends UI{

    private _container: StackPanel = new StackPanel();

    private _stackPanels: StackPanel[] = [];
    private _textBlocks: TextBlock[] = [];

    get controlNode(): Control {
        return this._container;
    }

    constructor(private _bbtext: BBText) {
        super();
        this._container.isVertical = true;
        this._container.width = "100%";
        this._container.background = "gray";
        this._container.onAfterDrawObservable.addOnce(() => {
            const segmentsLine = this.calculateSegmentsLine();
            this.createStackPanels(segmentsLine);
        })
        // TODO: écouter l'event de change de taille du rectangle et réorganiser
    }


    /*private createTextBlocksLine(segments: BBSegment[][]): TextBlock[][] {
        const textBlockLines: TextBlock[][] = [];
        segments.forEach((segmentLine) => {
            const currentTextBlockLine: TextBlock[] = [];
            segmentLine.forEach((segment) => {
                const textBlock = new TextBlock();
                textBlock.textWrapping = false;
                textBlock.resizeToFit = true;
                textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                textBlock.text = segment.text;
                textBlock.heightInPixels = 30;
                segment.style.tags.forEach(
                    tag => tag.apply(textBlock)
                );
                currentTextBlockLine.push(textBlock);
                this._textBlocks.push(textBlock);
            })
            textBlockLines.push(currentTextBlockLine);
        })
        return textBlockLines;
    }*/

    private calculateSegmentsLine(): BBSegment[][]{
        const maxWidth = this._container.widthInPixels;
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

    private getTextWidth(text: string, fontSize: number): number {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d");
        if(ctx){
            ctx.font = `${fontSize}px sans-serif`;
            return ctx.measureText(text).width;
        }
        else{
            throw new Error("Could not get text width");
        }
    }

    private createStackPanels(segmentsLine: BBSegment[][]) {
        segmentsLine.forEach(() => {
            const stackPanel = new StackPanel();
            this._stackPanels.push(stackPanel);
            this._container.addControl(stackPanel);
            stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            stackPanel.isVertical = false;
            stackPanel.width = "100%";
        })
        this._stackPanels.forEach( (stackPanel) => {
            stackPanel.onAfterDrawObservable.addOnce( () => {
                const index = this._stackPanels.indexOf(stackPanel);
                this.fillStackPanel(stackPanel, segmentsLine[index]);
                const textBlocksInStackPanel = stackPanel.children as TextBlock[];
                textBlocksInStackPanel.forEach((textBlock) => {
                    textBlock.onAfterDrawObservable.addOnce( () => {
                        stackPanel.heightInPixels = Math.max(0, stackPanel.heightInPixels, textBlock.heightInPixels * 1.2) ;
                        this.updateContainerHeight();
                    })
                })
            })
        });
    }

    private fillStackPanel(stackPanel: StackPanel, bbSegment: BBSegment[]) {
        bbSegment.forEach((segment) => {

            const textBlock = new TextBlock();
            textBlock.textWrapping = false;
            textBlock.resizeToFit = true;
            textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            textBlock.text = segment.text;

            const spaceAfterTextBlock = new TextBlock();
            spaceAfterTextBlock.textWrapping = false;
            spaceAfterTextBlock.resizeToFit = true;
            spaceAfterTextBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            spaceAfterTextBlock.text = "c";
            spaceAfterTextBlock.alpha = 0;
            segment.style.tags.forEach(
                tag => {
                    tag.apply(textBlock);
                    tag.apply(spaceAfterTextBlock);
                }
            );
            stackPanel.addControl(textBlock);
            stackPanel.addControl(spaceAfterTextBlock);
            this._textBlocks.push(textBlock);
        })
    }

    private updateContainerHeight() {
        let containerHeight = 0;
        this._stackPanels.forEach((stackPanel: StackPanel) => {
            containerHeight += Math.max(0, stackPanel.heightInPixels);
        })
        this._container.heightInPixels = containerHeight;
    }


}