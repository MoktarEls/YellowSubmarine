import { UI } from "@/YellowSubmarine/ui system/UI";
import { Control, TextBlock, Rectangle } from "@babylonjs/gui";
import { KeyZone } from "@/YellowSubmarine/keyzone system/KeyZone";

export class ShowKeyZoneNameUI extends UI {

    private _container: Rectangle;
    private _textBlock: TextBlock;

    get controlNode(): Control {
        return this._container;
    }

    constructor() {
        super();

        this._textBlock = new TextBlock();
        this._textBlock.color = "white";
        this._textBlock.textWrapping = true;
        this._textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        this._container = new Rectangle();
        this._container.width = "25%";
        this._container.height = "80px";
        this._container.cornerRadius = 12;
        this._container.color = "white";
        this._container.thickness = 2;
        this._container.background = "rgba(0, 0, 0, 0.6)";
        this._container.alpha = 0;
        this._container.addControl(this._textBlock);
        this._container.zIndex = 1;

        KeyZone.onAnyKeyZoneEntered.add((keyzone) => this.showName(keyzone));
    }

    private showName(keyzone: KeyZone) {
        this._textBlock.text = keyzone.name;

        if (keyzone.discovered) {
            this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            this._container.left = "20px";
            this._container.top = "-20px";

            this._textBlock.fontSize = "28px";
            this._textBlock.fontStyle = "normal";
        } else {
            this._container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            this._container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            this._container.paddingBottom = "30px";

            this._textBlock.fontSize = "36px";
            this._textBlock.fontStyle = "bold";
        }

        this.fadeTo(1, 300);

        setTimeout(() => {
            this.fadeTo(0, 500);
        }, 3000);
    }

    private fadeTo(targetAlpha: number, duration: number) {
        const startAlpha = this._container.alpha;
        const startTime = performance.now();

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this._container.alpha = startAlpha + (targetAlpha - startAlpha) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}
