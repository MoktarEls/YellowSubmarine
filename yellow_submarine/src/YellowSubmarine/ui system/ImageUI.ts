import { Control, Image } from "@babylonjs/gui";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Game} from "@/YellowSubmarine/Game";

export class ImageUI extends UI {

    private _imageControl: Image;

    constructor(imagePath: string) {
        super();
        this._imageControl = new Image("imageUI", imagePath);
        this._imageControl.width = 1;
        this._imageControl.height = 1;
        this._imageControl.stretch = Image.STRETCH_UNIFORM;
    }

    public get controlNode(): Control {
        return this._imageControl;
    }

    public fadeIn(duration: number) {
        const imageControl = this.controlNode as Image;
        imageControl.alpha = 0;

        const startTime = performance.now();

        const fadeObserver = Game.scene.onBeforeRenderObservable.add(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            imageControl.alpha = progress;

            if (progress >= 1) {
                Game.scene.onBeforeRenderObservable.remove(fadeObserver);
            }
        });
    }

    public fadeOut(duration: number) {
        const imageControl = this.controlNode as Image;
        imageControl.alpha = 1;

        const startTime = performance.now();

        const fadeObserver = Game.scene.onBeforeRenderObservable.add(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            imageControl.alpha = 1 - progress;

            if (progress >= 1) {
                Game.scene.onBeforeRenderObservable.remove(fadeObserver);
            }
        });
    }

}