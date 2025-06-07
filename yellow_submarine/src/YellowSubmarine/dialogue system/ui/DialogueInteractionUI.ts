import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, Rectangle, Image, StackPanel } from "@babylonjs/gui";
import { Dialogue } from "@/YellowSubmarine/dialogue system/Dialogue";
import { Utils } from "@/YellowSubmarine/Utils";
import { TextLayoutManager } from "@/YellowSubmarine/ui system/TextLayoutManager";
import {TextAnimator} from "@/YellowSubmarine/ui system/TextAnimator";

export class DialogueInteractionUI extends UI {

    private readonly CONTAINER_WIDTH = 0.4;
    private readonly CONTAINER_CORNER_RADIUS = 10;
    private readonly CONTAINER_THICKNESS = 5;
    private readonly CONTAINER_COLOR = "rgb(168, 98, 68)";
    private readonly CONTAINER_BACKGROUND = "rgb(255, 199, 130)";
    private readonly CONTAINER_OFFSET_Y = -200;

    private readonly TEXT_PADDING = 8;
    private readonly TEXT_BLOCK_HORIZONTAL_PADDING = 2;
    private readonly TEXT_DEFAULT_FONT_SIZE = 24;
    private readonly TEXT_LINE_SPACING = 8;
    private readonly TEXT_EXTRA_CONTAINER_MARGIN = 20;
    private readonly TEXT_SPEED = 20;

    private readonly TRIANGLE_IMAGE_PATH = "ui/triangle.png";
    private readonly TRIANGLE_SIZE = "24px";
    private readonly TRIANGLE_BLINK_INTERVAL = 300;

    private _container!: Rectangle;
    private _verticalStack!: StackPanel;
    private _triangle!: Image;

    private static _isTextFullyDisplayed = false;


    private _layoutManager: TextLayoutManager;
    private _textAnimator: TextAnimator;

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

        this._layoutManager = new TextLayoutManager(
            (() => {
                const canvas = document.createElement("canvas");
                return canvas.getContext("2d")!;
            })(),
            this.TEXT_DEFAULT_FONT_SIZE,
            this.TEXT_BLOCK_HORIZONTAL_PADDING
        );

        this._textAnimator = new TextAnimator();

        Dialogue.onAnyDialogueStartedObservable.add((dialogue) => {
            this._container.isVisible = true;
            this._container.linkWithMesh(dialogue.dialogueProvider?.mesh ?? null );
            this._container.linkOffsetY = this.CONTAINER_OFFSET_Y;
        });

        Dialogue.onAnyDialogueEndedObservable.add(() => {
            this._stopBlink();
            this._container.isVisible = false;
        });

        Dialogue.onAnyDialogueNodeStartedObservable.add((result) =>
            this.showText(result.node.mainText, this.TEXT_SPEED)
        );
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
    }

    private initStack() {
        this._verticalStack = new StackPanel();
        this._verticalStack.isVertical = true;
        this._verticalStack.width = "100%";
        this._verticalStack.paddingBottom = "5px";
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

    private async showText(text: string, speed: number) {
        DialogueInteractionUI._isTextFullyDisplayed = false;
        this._stopBlink();
        this._textAnimator.resetAdvance();
        this._verticalStack.clearControls();

        // TODO: For test purposes instantly display the entire text
        this._textAnimator.requestAdvance();
        /*const advanceObserver = Dialogue.onAdvanceDialogueRequestedObservable.add(() => {
            this._textAnimator.requestAdvance();
        });*/

        const canvasWidth = document.querySelector("canvas")!.clientWidth;
        const containerPixelWidth = canvasWidth * this.CONTAINER_WIDTH;
        const maxWidth =
            containerPixelWidth -
            this.TEXT_PADDING * 2 -
            this.TEXT_BLOCK_HORIZONTAL_PADDING * 2;

        const { lines, segments } = this._layoutManager.layout(text, maxWidth);

        const maxFontSize = Math.max(
            ...segments.map((s) => s.style.size || this.TEXT_DEFAULT_FONT_SIZE)
        );
        const lineHeight = maxFontSize * 1.2 + this.TEXT_LINE_SPACING;

        const { linesPanels, blocks } = this._layoutManager.createTextBlocks(
            lines,
            lineHeight,
            this.TEXT_BLOCK_HORIZONTAL_PADDING,
            this.TEXT_DEFAULT_FONT_SIZE
        );

        linesPanels.forEach(linePanel => {
            this._verticalStack.addControl(linePanel);
        });

        const contentHeight = lines.length * lineHeight;
        const totalHeight =
            contentHeight + this.TEXT_PADDING * 2 + this.TEXT_EXTRA_CONTAINER_MARGIN;
        this._container.height = `${totalHeight}px`;

        await this._textAnimator.animateBlocks(blocks, speed);

        if (this._textAnimator.advanceRequested) {
            blocks.forEach((b) => (b.tb.text = b.full));
        }

        DialogueInteractionUI._isTextFullyDisplayed = true;
        // Dialogue.onAdvanceDialogueRequestedObservable.remove(advanceObserver);
        await this._startBlink();
    }

    private async _startBlink() {
        if(!DialogueInteractionUI._isTextFullyDisplayed) return;
        this._triangle.isVisible = true;

        while (DialogueInteractionUI.isTextFullyDisplayed) {
            this._triangle.alpha = 1;
            await Utils.sleep(this.TRIANGLE_BLINK_INTERVAL);
            this._triangle.alpha = 0;
            await Utils.sleep(this.TRIANGLE_BLINK_INTERVAL);
        }


    }

    private _stopBlink() {
        this._triangle.isVisible = false;
    }
}
