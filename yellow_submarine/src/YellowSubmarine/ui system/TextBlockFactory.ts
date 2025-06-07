import { Control, StackPanel, TextBlock } from "@babylonjs/gui";
import { Segment } from "@/YellowSubmarine/ui system/BBCode/Segment";
import { BBStyle } from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export interface StyledTextBlock {
    tb: TextBlock;
    full: string;
}

export class TextBlockFactory {
    constructor(
        private defaultFontSize = 24,
        private textBlockHorizontalPadding = 4
    ) {}

    public create(
        lines: Segment[][],
        lineHeight: number
    ): { panels: StackPanel[]; blocks: StyledTextBlock[] } {
        const panels: StackPanel[] = [];
        const blocks: StyledTextBlock[] = [];

        for (const lineSegments of lines) {
            const row = new StackPanel();
            row.isVertical = false;
            row.height = `${lineHeight}px`;
            row.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            row.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

            for (const segment of lineSegments) {
                const tb = new TextBlock();
                tb.text = "";
                this.applyStyle(tb, segment.style);
                tb.textWrapping = false;
                tb.resizeToFit = true;
                tb.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                row.addControl(tb);
                blocks.push({ tb, full: segment.text });
            }

            panels.push(row);
        }

        return { panels, blocks };
    }

    private applyStyle(tb: TextBlock, style: BBStyle) {
        tb.fontWeight = style.bold ? "bold" : "normal";
        tb.fontStyle = style.italic ? "italic" : "normal";
        tb.color = style.color as string ?? "black";
        tb.fontSize = style.size as number ?? this.defaultFontSize;
        tb.paddingLeft = `${this.textBlockHorizontalPadding}px`;
        tb.paddingRight = `${this.textBlockHorizontalPadding}px`;
    }
}
