import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, TextBlock, Rectangle, Image, StackPanel } from "@babylonjs/gui";
import { Conversation } from "@/YellowSubmarine/dialogue system/Conversation";
import { Utils } from "@/YellowSubmarine/Utils";
import { BBParser } from "@/YellowSubmarine/ui system/BBCode/BBParser";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class DialogueInteractionUI extends UI {
    private _container: Rectangle;
    private _verticalStack: StackPanel;
    private _triangle: Image;
    private _parser = new BBParser();
    private _advanceRequested = false;
    private static _isTextFullyDisplayed = false;

    public get controlNode(): Control {
        return this._container;
    }
    public static get isTextFullyDisplayed(): boolean {
        return this._isTextFullyDisplayed;
    }

    constructor() {
        super();

        this._container = new Rectangle();
        this._container.width = "40%";
        this._container.cornerRadius = 10;
        this._container.thickness = 5;
        this._container.color = "rgb(168, 98, 68)";
        this._container.background = "rgb(255, 199, 130)";
        this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._container.isVisible = false;


        this._verticalStack = new StackPanel();
        this._verticalStack.isVertical = true;
        this._verticalStack.width = "100%";
        this._verticalStack.paddingTop = "4px";
        this._container.addControl(this._verticalStack);


        this._triangle = new Image("nextTriangle", "ui/triangle.png");
        this._triangle.width = "24px";
        this._triangle.height = "24px";
        this._triangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._triangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._triangle.isVisible = false;
        this._container.addControl(this._triangle);

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
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d')!;
        ctx.font = `${fontSize}px sans-serif`;
        return ctx.measureText(text).width;
    }

    private splitLines(segs: { text: string; style: BBStyle }[],
        maxWidth: number): { text: string; style: BBStyle }[][]
    {
        const lines: { text: string; style: BBStyle }[][] = [];
        let current: { text: string; style: BBStyle }[] = [];
        let width = 0;

        for (const seg of segs) {
            const segW = this.getTextWidth(seg.text, seg.style.size || 24);
            if (width + segW <= maxWidth) {
                current.push(seg);
                width += segW;
            } else {
                const parts = seg.text.split(/(\s+)/);
                for (const part of parts) {
                    const w = this.getTextWidth(part, seg.style.size || 24);
                    if (width + w > maxWidth && current.length) {
                        lines.push(current);
                        current = [];
                        width = 0;
                    }
                    current.push({ text: part, style: seg.style });
                    width += w;
                }
            }
        }
        if (current.length) lines.push(current);
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

    private async showText(text: string, speed: number) {
        DialogueInteractionUI._isTextFullyDisplayed = false;
        this._advanceRequested = false;
        this._verticalStack.clearControls();

        const obs = Conversation.onAdvanceDialogueRequested.add(() =>
            this._advanceRequested = true);

        const segs = this._parser.parseBBCode(text).map(s => ({ text: s.text, style: s.style }));
        const maxW = document.querySelector('canvas')!.clientWidth * 0.4 - 16;

        const lines = this.splitLines(segs, maxW);

        const blocks: { tb: TextBlock; full: string }[] = [];
        const maxFont = Math.max(...segs.map(s => s.style.size || 24));
        const lh = maxFont + 8;

        lines.forEach(parts => {
            const row = new StackPanel();
            row.isVertical = false;
            row.height = `${lh}px`;
            this._verticalStack.addControl(row);
            parts.forEach(p => {
                const tb = new TextBlock();
                tb.text = '';
                this.applyStyle(tb, p.style);
                tb.textWrapping = false;
                tb.resizeToFit = true;
                row.addControl(tb);
                blocks.push({ tb, full: p.text });
            });
        });


        const totalH = lines.length * lh + 16;
        this._container.height = `${totalH}px`;

        let stopped = false;
        for (const { tb, full } of blocks) {
            for (let i = 1; i <= full.length; i++) {
                tb.text = full.slice(0, i);
                if (this._advanceRequested) { stopped = true; break; }
                await Utils.sleep(speed);
            }
            if (stopped) break;
        }
        if (this._advanceRequested) blocks.forEach(b => b.tb.text = b.full);

        DialogueInteractionUI._isTextFullyDisplayed = true;
        Conversation.onAdvanceDialogueRequested.remove(obs);
        this._startBlink();
    }

    private async _startBlink() {
        if (this._triangle.isVisible) return;
        this._triangle.isVisible = true;
        while (!this._advanceRequested) {
            this._triangle.alpha = 1; await Utils.sleep(300);
            this._triangle.alpha = 0; await Utils.sleep(300);
        }
        this._triangle.alpha = 1;
    }
    private _stopBlink() {
        this._triangle.isVisible = false;
        this._triangle.alpha = 1;
    }
}
