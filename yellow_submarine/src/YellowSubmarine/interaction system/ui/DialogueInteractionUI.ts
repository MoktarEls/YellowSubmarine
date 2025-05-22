import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, TextBlock, Rectangle, Image, StackPanel } from "@babylonjs/gui";
import { Conversation } from "@/YellowSubmarine/dialogue system/Conversation";
import { Utils } from "@/YellowSubmarine/Utils";
import { BBParser } from "@/YellowSubmarine/ui system/BBCode/BBParser";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";

// Interfaces de structure
interface StyledSegment {
    text: string;
    style: BBStyle;
}

interface StyledTextBlock {
    tb: TextBlock;
    full: string;
}

export class DialogueInteractionUI extends UI {
    private _container!: Rectangle;
    private _verticalStack!: StackPanel;
    private _triangle!: Image;

    private _parser = new BBParser();
    private _advanceRequested = false;
    private static _isTextFullyDisplayed = false;

    public get controlNode(): Control {
        return this._container;
    }

    public static get isTextFullyDisplayed(): boolean {
        return this._isTextFullyDisplayed;
    }

    private initContainer() {
        this._container = new Rectangle();
        this._container.width = "40%";
        this._container.cornerRadius = 10;
        this._container.thickness = 5;
        this._container.color = "rgb(168, 98, 68)";
        this._container.background = "rgb(255, 199, 130)";
        this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._container.isVisible = false;
    }

    private initStack(){
        this._verticalStack = new StackPanel();
        this._verticalStack.isVertical = true;
        this._verticalStack.width = "100%";
        this._verticalStack.paddingTop = "4px";
        this._container.addControl(this._verticalStack);
    }

    private initTriangle(){
        this._triangle = new Image("nextTriangle", "ui/triangle.png");
        this._triangle.width = "24px";
        this._triangle.height = "24px";
        this._triangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._triangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._triangle.isVisible = false;
        this._container.addControl(this._triangle);
    }

    constructor() {
        super();

        this.initContainer();
        this.initStack();
        this.initTriangle();

        Conversation.onAnyConversationStart.add(conv => {
            this._container.isVisible = true;
            if (conv.npc?.mesh) {
                this._container.linkWithMesh(conv.npc.mesh);
                this._container.linkOffsetY = -200;
            }
        });

        Conversation.onAnyConversationEnd.add(() => {
            this._stopBlink();
            this._container.isVisible = false;
        });

        Conversation.onAnyDialogueStart.add(dialog => this.showText(dialog.text, 20));
    }

    private getTextWidth(text: string, fontSize: number): number {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = `${fontSize}px sans-serif`;
        return ctx.measureText(text).width;
    }

    private async showText(text: string, speed: number) {
        DialogueInteractionUI._isTextFullyDisplayed = false;
        this._advanceRequested = false;
        this._verticalStack.clearControls();

        const advanceObserver = Conversation.onAdvanceDialogueRequested.add(() =>
            this._advanceRequested = true
        );

        const segments: StyledSegment[] = this._parser.parseBBCode(text).map(s => ({
            text: s.text,
            style: s.style
        }));

        const maxWidth = document.querySelector('canvas')!.clientWidth * 0.4 - 16;
        const lines = this.splitLines(segments, maxWidth);

        const blocks: StyledTextBlock[] = [];
        const maxFontSize = Math.max(...segments.map(s => s.style.size || 24));
        const lineHeight = maxFontSize + 8;

        // Création visuelle des lignes de texte
        lines.forEach(lineSegments => {
            const row = new StackPanel();
            row.isVertical = false;
            row.height = `${lineHeight}px`;
            this._verticalStack.addControl(row);

            lineSegments.forEach(segment => {
                const tb = new TextBlock();
                tb.text = '';
                this.applyStyle(tb, segment.style);
                tb.textWrapping = false;
                tb.resizeToFit = true;
                row.addControl(tb);
                blocks.push({ tb, full: segment.text });
            });
        });

        const totalHeight = lines.length * lineHeight + 16;
        this._container.height = `${totalHeight}px`;

        await this.animateBlocks(blocks, speed);

        if (this._advanceRequested) {
            blocks.forEach(b => b.tb.text = b.full);
        }

        DialogueInteractionUI._isTextFullyDisplayed = true;
        Conversation.onAdvanceDialogueRequested.remove(advanceObserver);
        await this._startBlink();
    }

    private splitLines(segments: StyledSegment[], maxWidth: number): StyledSegment[][] {
        const lines: StyledSegment[][] = [];
        let currentLine: StyledSegment[] = [];
        let currentWidth = 0;

        for (const segment of segments) {
            const segWidth = this.getTextWidth(segment.text, segment.style.size || 24);

            if (currentWidth + segWidth <= maxWidth) {
                currentLine.push(segment);
                currentWidth += segWidth;
            } else {
                const parts = segment.text.split(/(\s+)/);
                for (const part of parts) {
                    const partWidth = this.getTextWidth(part, segment.style.size || 24);
                    if (currentWidth + partWidth > maxWidth && currentLine.length) {
                        lines.push(currentLine);
                        currentLine = [];
                        currentWidth = 0;
                    }
                    currentLine.push({ text: part, style: segment.style });
                    currentWidth += partWidth;
                }
            }
        }

        if (currentLine.length) lines.push(currentLine);
        return lines;
    }

    private applyStyle(tb: TextBlock, style: BBStyle) {
        tb.fontWeight = style.bold ? 'bold' : 'normal';
        tb.fontStyle = style.italic ? 'italic' : 'normal';
        tb.color = style.color || 'black';
        tb.fontSize = style.size || 24;
        tb.paddingLeft = "4px";
        tb.paddingRight = "4px";
    }

    private async animateBlocks(blocks: StyledTextBlock[], speed:number) {
        // Animation du texte
        let skipped = false;
        for (const { tb, full } of blocks) {
            for (let i = 1; i <= full.length; i++) {
                tb.text = full.slice(0, i);
                if (this._advanceRequested) {
                    skipped = true;
                    break;
                }
                await Utils.sleep(speed);
            }
            if (skipped) break;
        }
    }

    private async _startBlink() {
        if (this._triangle.isVisible) return;
        this._triangle.isVisible = true;

        while (!this._advanceRequested) {
            this._triangle.alpha = 1;
            await Utils.sleep(300);
            this._triangle.alpha = 0;
            await Utils.sleep(300);
        }

        this._triangle.alpha = 1;
    }

    private _stopBlink() {
        this._triangle.isVisible = false;
        this._triangle.alpha = 1;
    }
}
