import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Control, Image, Rectangle, StackPanel} from "@babylonjs/gui";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {Utils} from "@/YellowSubmarine/Utils";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {BBTextBlock} from "@/YellowSubmarine/BBCode/custom node/BBTextBlock";
import {Game} from "@/YellowSubmarine/Game";

export class DialogueNodeUI extends UI{
    // TODO : Put in there all the logic that is shared across any dialogue node ui
    // TODO : Creates extension of this class for every types of dialogue node that need a specific logic
    // TODO : Logic shared : - Writing Main Text, With animation, And sound playing
    // TODO : Logic shared : - When pressing space, the Text is fully displayed if it wasn't the case or the dialogue advance
    // TODO : Logic shared : - Outline and Background color
    // TODO : Logic shared : - Uses BBTextBlocks instead of TextBlocks
    // TODO : Logic shared : - Shows

    private readonly CONTAINER_WIDTH = 0.4;
    private readonly CONTAINER_CORNER_RADIUS = 10;
    private readonly CONTAINER_THICKNESS = 5;
    private readonly CONTAINER_COLOR = "rgb(168, 98, 68)";
    private readonly CONTAINER_BACKGROUND = "rgb(255, 199, 130)";
    private readonly CONTAINER_OFFSET_Y = -200;

    private readonly TEXT_PADDING = 16;
    private readonly TEXT_BLOCK_HORIZONTAL_PADDING = 2;
    private readonly TEXT_DEFAULT_FONT_SIZE = 24;
    private readonly TEXT_LINE_SPACING = 8;
    private readonly TEXT_EXTRA_CONTAINER_MARGIN = 20;
    private readonly TEXT_SPEED = 20;

    private readonly TRIANGLE_IMAGE_PATH = "ui/triangle.png";
    private readonly TRIANGLE_SIZE = "24px";
    private readonly TRIANGLE_BLINK_INTERVAL = 300;

    private _container!: Rectangle;
    private _triangle!: Image;
    private _bbTextBlock!: BBTextBlock;

    public get controlNode(): Control {
        return this._container;
    }

    public static get isTextFullyDisplayed(): boolean {
        throw new Error("Not Implemented");
    }

    public static displayEntireText() {
        // TODO : Finish displaying the text
        throw new Error("Not Implemented");
    }

    constructor() {
        super();

        this.initContainer();
        this.initTriangle();
        this.initBBTextBlock();

        Dialogue.onAnyDialogueStartedObservable.add((dialogue) => {
            this._container.isVisible = true;
            this._container.linkWithMesh(dialogue.dialogueProvider?.mesh ?? null );
            this._container.linkOffsetY = this.CONTAINER_OFFSET_Y;
        });

        Dialogue.onAnyDialogueEndedObservable.add(() => {
            this._container.isVisible = false;
        });

        Dialogue.onAnyDialogueNodeStartedObservable.add((result) =>{
            // TODO : show the text progressively, than show the triangle when the text is fully shown
            this._bbTextBlock.bbText = result.node.bbText;
            // throw new Error("Not Implemented");
        });
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
        this._container.paddingTop = `${this.TEXT_PADDING}px`;
        this._container.paddingBottom = `${this.TEXT_PADDING}px`;
        this._container.paddingLeft = `${this.TEXT_PADDING}px`;
        this._container.paddingRight = `${this.TEXT_PADDING}px`;
        this._container.descendantsOnlyPadding = true;
        this._container.adaptHeightToChildren = true;
    }

    private initTriangle() {
        this._triangle = new Image("nextTriangle", this.TRIANGLE_IMAGE_PATH);
        this._triangle.width = this.TRIANGLE_SIZE;
        this._triangle.height = this.TRIANGLE_SIZE;
        this._triangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._triangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._triangle.isVisible = true;
        this._container.addControl(this._triangle);
    }

    private initBBTextBlock(){
        this._bbTextBlock = new BBTextBlock();
        this._container.addControl(this._bbTextBlock.controlNode);
    }

}