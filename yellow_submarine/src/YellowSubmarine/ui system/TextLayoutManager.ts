﻿import { BBParser } from "@/YellowSubmarine/ui system/BBCode/BBParser";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";
import { Control, TextBlock, StackPanel } from "@babylonjs/gui";

export interface StyledSegment {
    text: string;
    style: BBStyle;
}

export interface StyledTextBlock {
    tb: TextBlock;
    full: string;
}

export class TextLayoutManager {
    private parser: BBParser;
    private ctx: CanvasRenderingContext2D;
    private defaultFontSize: number;
    private horizontalPadding: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        defaultFontSize = 24,
        horizontalPadding = 4
    ) {
        this.parser = new BBParser();
        this.ctx = ctx;
        this.defaultFontSize = defaultFontSize;
        this.horizontalPadding = horizontalPadding;
    }

    public layout(text: string, maxWidth: number): { lines: StyledSegment[][]; segments: StyledSegment[] } {
        const segments = this.parser.parseBBCode(text).map(s => ({
            text: s.text,
            style: s.style
        }));

        const lines = this.splitLines(segments, maxWidth);

        return { lines, segments };
    }

    private getTextWidth(text: string, fontSize: number): number {
        this.ctx.font = `${fontSize}px sans-serif`;
        return this.ctx.measureText(text).width;
    }

    private splitLines(segments: StyledSegment[], maxWidth: number): StyledSegment[][] {
        const lines: StyledSegment[][] = [];
        let currentLine: StyledSegment[] = [];
        let currentWidth = 0;

        for (const segment of segments) {
            const fontSize = segment.style.size || this.defaultFontSize;
            const segWidth = this.getTextWidth(segment.text, fontSize) + this.horizontalPadding * 2;

            if (currentWidth + segWidth <= maxWidth) {
                currentLine.push(segment);
                currentWidth += segWidth;
            } else {
                const parts = segment.text.split(/(\s+)/);

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

    /**
     * Crée les StackPanels (lignes) et TextBlocks (segments) formatés.
     * Renvoie un tableau d'objets pour animer le texte.
     */
    public createTextBlocks(
        lines: StyledSegment[][],
        lineHeight: number,
        textBlockHorizontalPadding: number,
        defaultFontSize: number
    ): { linesPanels: StackPanel[]; blocks: StyledTextBlock[] } {
        const blocks: StyledTextBlock[] = [];
        const linesPanels: StackPanel[] = [];

        lines.forEach(lineSegments => {
            const row = new StackPanel();
            row.isVertical = false;
            row.height = `${lineHeight}px`;
            row.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            row.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

            lineSegments.forEach(segment => {
                const tb = new TextBlock();
                tb.text = "";
                this.applyStyle(tb, segment.style, textBlockHorizontalPadding, defaultFontSize);
                tb.textWrapping = false;
                tb.resizeToFit = true;
                tb.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

                row.addControl(tb);
                blocks.push({ tb, full: segment.text });
            });

            linesPanels.push(row);
        });

        return { linesPanels, blocks };
    }

    private applyStyle(tb: TextBlock, style: BBStyle, padding: number, defaultFontSize: number) {
        tb.fontWeight = style.bold ? "bold" : "normal";
        tb.fontStyle = style.italic ? "italic" : "normal";
        tb.color = style.color || "black";
        tb.fontSize = style.size || defaultFontSize;
        tb.paddingLeft = `${padding}px`;
        tb.paddingRight = `${padding}px`;
    }
}
