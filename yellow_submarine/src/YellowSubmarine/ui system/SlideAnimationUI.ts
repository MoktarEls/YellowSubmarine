import {Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {ImageUI} from "@/YellowSubmarine/ui system/ImageUI";
import {KeyboardEventTypes} from "@babylonjs/core";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";

export class SlideAnimationUI {
    private ui = UIManager.instance.ui;
    private _slides!: ImageUI[];
    private currentIndex = 0;

    private slidePanel: Rectangle;
    private spaceLabel: TextBlock;
    private static _instance: SlideAnimationUI;

    public static get instance(): SlideAnimationUI {
        return this._instance;
    }

    constructor() {
        SlideAnimationUI._instance = this;
        this.setSlides();

        this.slidePanel = new Rectangle("slidePanel");
        this.slidePanel.width = "100%";
        this.slidePanel.height = "100%";
        this.slidePanel.isVisible = true;
        this.slidePanel.alpha = 0;
        this.ui.addControl(this.slidePanel);

        this.spaceLabel = new TextBlock();
        this.spaceLabel.text = "Space";
        this.spaceLabel.color = "black";
        this.spaceLabel.fontSize = 32;
        this.spaceLabel.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        this.spaceLabel.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        this.spaceLabel.paddingRight = "40px";
        this.spaceLabel.paddingBottom = "20px";
        this.spaceLabel.zIndex = 1;

        this.animateBlinkingText(this.spaceLabel, 2000);

        this.slidePanel.addControl(this.spaceLabel);
    }

    private animateBlinkingText(textControl: TextBlock, duration= 1000) {
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const progress = (elapsed % duration) / duration;

            textControl.alpha = 0.65 + 0.35 * Math.sin(progress * 2 * Math.PI);

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }


    public async startSlideshow(): Promise<void> {
        if (this._slides.length === 0) return;

        this.currentIndex = 0;

        await this.fadeInPanel(500);

        this.showSlide(this.currentIndex);

        const onKeyDown = async (evt: KeyboardEvent) => {
            if (evt.code === "Space") {
                this.currentIndex++;
                if (this.currentIndex < this._slides.length) {
                    this.showSlide(this.currentIndex);
                }
            }
        };

        window.addEventListener("keydown", onKeyDown);
    }


    private showSlide(index: number) {
        if(index != 0) this._slides[index-1].fadeOut(500);
        const slide = this._slides[index];
        this.slidePanel.addControl(slide.controlNode);
        this._slides[index].fadeIn(500);
        switch(index) {
            case 0:
                SoundManager.instance.playSFX("snoring", {autoplay: true, loop: true});
                break;
            case 1:
                SoundManager.instance.stopSFX("snoring");
                SoundManager.instance.playSFX("earthquake", {autoplay: true, loop: true});
                break;
            case 3:
                SoundManager.instance.stopSFX("earthquake");
                SoundManager.instance.playSFX("whale", {autoplay: true, loop: false});
                break;
            case 4:
                SoundManager.instance.playSFX("plock");
                break;
            case 5:
                SoundManager.instance.playSFX("stars", {autoplay: true, loop: false});
                SoundManager.instance.playSFX("snoring", {autoplay: true, loop: false});
                break;
            case 6:
                SoundManager.instance.stopSFX("snoring");

        }
    }

    private fadeInPanel(duration: number): Promise<void> {
        return new Promise((resolve) => {
            this.slidePanel.alpha = 0;

            const scene = Game.scene;
            const startTime = performance.now();

            const observer = scene.onBeforeRenderObservable.add(() => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                this.slidePanel.alpha = progress;

                if (progress >= 1) {
                    scene.onBeforeRenderObservable.remove(observer);
                    resolve();
                }
            });
        });
    }

    public setSlides() {
        this._slides = [
            new ImageUI("ui/slides/slide1.png"),
            new ImageUI("ui/slides/slide2.png"),
            new ImageUI("ui/slides/slide3.png"),
            new ImageUI("ui/slides/slide4.png"),
            new ImageUI("ui/slides/slide5.png"),
            new ImageUI("ui/slides/slide6.png"),
            new ImageUI("ui/slides/slide7.png"),
        ];
    }
}
