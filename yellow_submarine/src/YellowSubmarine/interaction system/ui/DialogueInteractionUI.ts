import { UI } from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock, Rectangle, Image, StackPanel} from "@babylonjs/gui";
import { Conversation } from "@/YellowSubmarine/dialogue system/Conversation";
import {Utils} from "@/YellowSubmarine/Utils";
import {BBParser} from "@/YellowSubmarine/ui system/BBCode/BBParser";
import {BBStyle} from "@/YellowSubmarine/ui system/BBCode/BBStyle";

export class DialogueInteractionUI extends UI {

    private _stackPanel: StackPanel;
    private _container: Rectangle;
    private _triangle!: Image;
    private _isBlinking = false;
    private _advanceRequested = false;
    private _parser = new BBParser();

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
        this._container.height = "15%";
        this._container.cornerRadius = 10;
        this._container.thickness = 5;
        this._container.color = "rgb(168, 98, 68)";  // bordure marron
        this._container.background = "rgb(255, 199, 130)"; // fond clair
        this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._container.isVisible = false;

        this._stackPanel = new StackPanel();
        this._stackPanel.isVertical = false;
        this._stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._stackPanel.height = "95%";
        this._stackPanel.width = "95%";

        this._container.addControl(this._stackPanel);

        this._triangle = new Image("nextTriangle", "ui/triangle.png");
        this._triangle.width = "24px";
        this._triangle.height = "24px";
        this._triangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._triangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._triangle.isVisible = false;

        this._container.addControl(this._triangle);

        // Événements
        Conversation.onAnyConversationStart.add((conversation) => {
            this._container.isVisible = true;
            const mesh = conversation.npc?.mesh;
            if(mesh){
                this._container.linkWithMesh(mesh);
                this._container.linkOffsetY = -200;
            }
        });

        Conversation.onAnyConversationEnd.add(() => {
            this.stopBlinkingIndicator();
            this._container.isVisible = false;
        });

        Conversation.onAnyDialogueStart.add((dialog) => {
            this.showText(dialog.text, 20);
        });

    }

    private applyStyleToTextBlock(textBlock: TextBlock, style: BBStyle): void {
        if (style.bold) {
            textBlock.fontWeight = "bold";
        }
        if (style.italic) {
            textBlock.fontStyle = "italic";
        }
        if (style.color) {
            textBlock.color = style.color;
        } else {
            textBlock.color = "black";
        }
        if (style.size) {
            textBlock.fontSize = style.size;
        } else {
            textBlock.fontSize = 24;
        }
    }

    private async showText(text: string, speed: number) {
        this.stopBlinkingIndicator();
        DialogueInteractionUI._isTextFullyDisplayed = false;
        this._advanceRequested = false;

        this._stackPanel.clearControls();

        const observer = Conversation.onAdvanceDialogueRequested.add( () => {
            this._advanceRequested = true;
        });

        const segments = this._parser.parseBBCode(text);
        const textBlocks: TextBlock[] = [];

        for(const segment of segments) {
            const tb = new TextBlock();
            tb.text = "";
            tb.fontSize = 24;
            tb.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            tb.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            tb.resizeToFit = true;
            tb.textWrapping = false;
            tb.paddingLeft = "3px";
            tb.paddingRight = "3px";
            this.applyStyleToTextBlock(tb, segment.style);
            this._stackPanel.addControl(tb);
            textBlocks.push(tb);
        }

        let segmentIndex = 0;
        let charIndex = 0;

        while(segmentIndex < segments.length) {
            if(this._advanceRequested) {

                for (let i = 0; i < segments.length; i++) {
                    textBlocks[i].text = segments[i].text;
                }
                break;
            }

            const currentSegment = segments[segmentIndex];
            const currentTextBlock = textBlocks[segmentIndex];

            if (charIndex < currentSegment.text.length) {
                currentTextBlock.text += currentSegment.text[charIndex];
                charIndex++;
                await Utils.sleep(speed);
            } else {
                segmentIndex++;
                charIndex = 0;
            }

        }

        DialogueInteractionUI._isTextFullyDisplayed = true;
        this._advanceRequested = false;
        Conversation.onAdvanceDialogueRequested.remove(observer);
        await this.startBlinkingIndicator();
    }


    private async startBlinkingIndicator() {
        if(this._isBlinking) return;

        this._isBlinking = true;
        this._triangle.isVisible = true;
        while (this._isBlinking) {
            this._triangle.alpha = 1;
            await Utils.sleep(300);
            this._triangle.alpha = 0;
            await Utils.sleep(300);
        }

        this._triangle.isVisible = true;
    }


    private stopBlinkingIndicator() {
        this._isBlinking = false;
        this._triangle.isVisible = false;
        this._triangle.alpha = 1;
    }

}
