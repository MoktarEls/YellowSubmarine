import { UI } from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock, Rectangle, Image} from "@babylonjs/gui";
import { Conversation } from "@/YellowSubmarine/dialogue system/Conversation";
import {Utils} from "@/YellowSubmarine/Utils";

export class DialogueInteractionUI extends UI {

    private _textBlock: TextBlock;
    private _container: Rectangle;
    private _triangle!: Image;
    private _isBlinking = false;

    public get controlNode(): Control {
        return this._container;
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

        this._textBlock = new TextBlock();
        this._textBlock.color = "black";
        this._textBlock.fontSize = 24;
        this._textBlock.textWrapping = true;
        this._textBlock.width = "90%";  // un peu de marge horizontale
        this._textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        this._container.addControl(this._textBlock);

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
            this.showText(this._textBlock, dialog.text, 20);
        });

    }

    private async showText(textBlock: TextBlock, text: string, speed: number) {
        this.stopBlinkingIndicator();
        textBlock.text = "";
        let currentText = "";
        for(let i = 0; i < text.length; i++) {
            currentText += text[i];
            textBlock.text = currentText;
            await Utils.sleep(speed);
        }
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
