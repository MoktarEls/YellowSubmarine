import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, TextBlock, Rectangle, Image, StackPanel } from "@babylonjs/gui";
import { Conversation } from "@/YellowSubmarine/dialogue system/Conversation";
import { Utils } from "@/YellowSubmarine/Utils";
import { BBParser } from "@/YellowSubmarine/ui system/BBCode/BBParser";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";

interface StyledSegment {
    text: string;
    style: BBStyle;
}

interface StyledTextBlock {
    tb: TextBlock;
    full: string;
}

export class DialogueInteractionUI extends UI {
    // Constantes
    private readonly CONTAINER_WIDTH = 0.4;
    private readonly CONTAINER_CORNER_RADIUS = 10;
    private readonly CONTAINER_THICKNESS = 5;
    private readonly CONTAINER_COLOR = "rgb(168, 98, 68)";
    private readonly CONTAINER_BACKGROUND = "rgb(255, 199, 130)";
    private readonly CONTAINER_OFFSET_Y = -200;

    private readonly TEXT_PADDING = 8; // padding global du container
    private readonly TEXT_BLOCK_HORIZONTAL_PADDING = 4; // padding horizontal pour chaque segment
    private readonly TEXT_DEFAULT_FONT_SIZE = 24;
    private readonly TEXT_LINE_SPACING = 8;
    private readonly TEXT_EXTRA_CONTAINER_MARGIN = 20;
    private readonly TEXT_SPEED = 20;

    private readonly TRIANGLE_IMAGE_PATH = "ui/triangle.png";
    private readonly TRIANGLE_SIZE = "24px";
    private readonly TRIANGLE_BLINK_INTERVAL = 300;

    // Membres internes
    private _container!: Rectangle;
    private _verticalStack!: StackPanel;
    private _triangle!: Image;

    private _parser = new BBParser();
    private _advanceRequested = false;
    private static _isTextFullyDisplayed = false;

    // Canvas pour mesure du texte
    private _canvas = document.createElement('canvas');
    private _ctx = this._canvas.getContext('2d')!;

    public get controlNode(): Control {
        return this._container;
    }

    public static get isTextFullyDisplayed(): boolean {
        return this._isTextFullyDisplayed;
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
                this._container.linkOffsetY = this.CONTAINER_OFFSET_Y;
            }
        });

        Conversation.onAnyConversationEnd.add(() => {
            this._stopBlink();
            this._container.isVisible = false;
        });

        Conversation.onAnyDialogueStart.add(dialog =>
            this.showText(dialog.text, this.TEXT_SPEED));
    }

    private initContainer() {
        this._container = new Rectangle();
        this._container.width = `${this.CONTAINER_WIDTH * 100}%`;
        this._container.cornerRadius = this.CONTAINER_CORNER_RADIUS;
        this._container.thickness = this.CONTAINER_THICKNESS;
        this._container.color = this.CONTAINER_COLOR;
        this._container.background = this.CONTAINER_BACKGROUND;
        this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._container.isVisible = false;

        this._container.paddingLeft = `${this.TEXT_PADDING}px`;
        this._container.paddingRight = `${this.TEXT_PADDING}px`;
        this._container.paddingTop = `${this.TEXT_PADDING}px`;
        this._container.paddingBottom = `${this.TEXT_PADDING}px`;
    }

    private initStack() {
        this._verticalStack = new StackPanel();
        this._verticalStack.isVertical = true;
        this._verticalStack.width = "100%";
        this._container.addControl(this._verticalStack);
    }

    private initTriangle() {
        this._triangle = new Image("nextTriangle", this.TRIANGLE_IMAGE_PATH);
        this._triangle.width = this.TRIANGLE_SIZE;
        this._triangle.height = this.TRIANGLE_SIZE;
        this._triangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._triangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._triangle.isVisible = false;
        this._container.addControl(this._triangle);
    }

    private getTextWidth(text: string, fontSize: number = this.TEXT_DEFAULT_FONT_SIZE): number {
        this._ctx.font = `${fontSize}px sans-serif`;
        return this._ctx.measureText(text).width;
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

        const canvasWidth = document.querySelector('canvas')!.clientWidth;
        const containerPixelWidth = canvasWidth * this.CONTAINER_WIDTH;
        // on enlève le padding container ET 2x padding horizontal segment
        const maxWidth = containerPixelWidth - this.TEXT_PADDING * 2 - this.TEXT_BLOCK_HORIZONTAL_PADDING * 2;

        const lines = this.splitLines(segments, maxWidth);

        const blocks: StyledTextBlock[] = [];
        const maxFontSize = Math.max(...segments.map(s => s.style.size || this.TEXT_DEFAULT_FONT_SIZE));
        const lineHeight = maxFontSize * 1.2 + this.TEXT_LINE_SPACING;

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
                // Pour centrer verticalement le texte dans la ligne
                tb.paddingTop = `${(lineHeight - (segment.style.size || this.TEXT_DEFAULT_FONT_SIZE)) / 2}px`;
                tb.paddingBottom = tb.paddingTop;
                row.addControl(tb);
                blocks.push({ tb, full: segment.text });
            });
        });

        const contentHeight = lines.length * lineHeight;
        const totalHeight = contentHeight + this.TEXT_PADDING * 2 + this.TEXT_EXTRA_CONTAINER_MARGIN;
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
            const fontSize = segment.style.size || this.TEXT_DEFAULT_FONT_SIZE;
            const segWidth = this.getTextWidth(segment.text, fontSize) + this.TEXT_BLOCK_HORIZONTAL_PADDING * 2;

            if (currentWidth + segWidth <= maxWidth) {
                currentLine.push(segment);
                currentWidth += segWidth;
            } else {
                const parts = segment.text.split(/(\s+)/);

                for (const part of parts) {
                    if (part === '' || (part.trim() === '' && currentLine.length === 0)) {
                        // Ignore empty parts or spaces at start of line
                        continue;
                    }
                    const partWidth = this.getTextWidth(part, fontSize) + this.TEXT_BLOCK_HORIZONTAL_PADDING * 2;
                    if (currentWidth + partWidth > maxWidth && currentLine.length) {
                        lines.push(currentLine);
                        currentLine = [];
                        currentWidth = 0;
                        if (part.trim() === '') continue; // Don't start line with space
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
        tb.fontSize = style.size || this.TEXT_DEFAULT_FONT_SIZE;
        tb.paddingLeft = `${this.TEXT_BLOCK_HORIZONTAL_PADDING}px`;
        tb.paddingRight = `${this.TEXT_BLOCK_HORIZONTAL_PADDING}px`;
    }

    private async animateBlocks(blocks: StyledTextBlock[], speed: number) {
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
            await Utils.sleep(this.TRIANGLE_BLINK_INTERVAL);
            this._triangle.alpha = 0;
            await Utils.sleep(this.TRIANGLE_BLINK_INTERVAL);
        }

        this._triangle.alpha = 1;
    }

    private _stopBlink() {
        this._triangle.isVisible = false;
        this._triangle.alpha = 1;
    }
}
