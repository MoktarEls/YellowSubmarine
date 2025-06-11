import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, StackPanel, TextBlock} from "@babylonjs/gui";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {ITextMetrics} from "@babylonjs/core";

export class BBTextBlock extends UI{

    private _container: StackPanel = new StackPanel();

    private _stackPanels: StackPanel[] = [];
    private _textBlocks: TextBlock[] = [];
    private _bbtext?: BBText

    get controlNode(): Control {
        return this._container;
    }

    constructor() {
        super();
        this._container.isVertical = true;

    }

    public showSubPortionOfCharacters(numberOfCharacters: number) {
        // TODO : Make it so that the BBTextBlock only shows the @numberOfCharacters first characters
        throw new Error("Not implemented");
    }

    public isTextFullyDisplayed(): boolean {
        // TODO : Returns true if the entire text is visible and false otherwise
        throw new Error("Not implemented");
    }

    public set bbText(bbText: BBText) {
        this._bbtext = bbText;
        this._container.onAfterDrawObservable.addOnce(() => {
            this.recreate();
            // TODO: écouter l'event de changement de taille du rectangle et réorganiser
            // TODO: une manière de faire ça serait de retenir la width et la height de la frame précédente et voir si elle à changer ou pas.
        });
    }

    private recreate(){
        this._textBlocks.forEach(tb => tb.dispose());
        this._stackPanels.forEach(s => s.dispose());

        this._textBlocks = [];
        this._stackPanels = [];

        const segmentsLine = this.calculateSegmentsLine();
        this.createStackPanels(segmentsLine);
    }

    private calculateSegmentsLine(): BBSegment[][]{
        if(this._bbtext){
            const maxWidth = this._container.widthInPixels;
            const lines: BBSegment[][] = [];
            let currentLine: BBSegment[] = [];
            let currentWidth = 0;

            for (const segment of this._bbtext.segments) {
                const fontSize = segment.fontSizeInPixels;
                const segWidth = this.getTextMetrics(segment.text, fontSize).width;

                if (currentWidth + segWidth <= maxWidth) {
                    currentLine.push(segment);
                    currentWidth += segWidth;
                } else {
                    const parts = segment.text.split(/(\s+)/); // split on spaces

                    for (const part of parts) {
                        if (part.trim() === "") continue;

                        const partWidth = this.getTextMetrics(part, fontSize).width;
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

        return [];

    }

    private getTextMetrics(text: string, fontSize: number): ITextMetrics {
        const ctx = UIManager.canvasRenderingContext2D;
        if(ctx){
            ctx.font = `${fontSize}px sans-serif`;
            return ctx.measureText(text);
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
            stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            stackPanel.isVertical = false;
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
            const textMetrics = this.getTextMetrics(segment.text.trim(), segment.fontSizeInPixels);
            textBlock.widthInPixels = textMetrics.actualBoundingBoxRight - textMetrics.actualBoundingBoxLeft;
            textBlock.heightInPixels = segment.fontSizeInPixels * 1.2;
            textBlock.isHighlighted = true;
            textBlock.highlightColor = "red"
            textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            textBlock.text = segment.text;

            const spaceAfterTextBlock = new TextBlock();
            spaceAfterTextBlock.textWrapping = false;
            spaceAfterTextBlock.resizeToFit = true;
            spaceAfterTextBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            spaceAfterTextBlock.text = "J";
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