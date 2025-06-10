import { Utils } from "@/YellowSubmarine/Utils";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";
import {displaySegment} from "@/YellowSubmarine/ui system/TextBlockFactory";

export class TextAnimator {
    private _advanceRequested = false;

    public get advanceRequested() {
        return this._advanceRequested;
    }

    public requestAdvance() {
        this._advanceRequested = true;
    }

    public resetAdvance() {
        this._advanceRequested = false;
    }

    public async animateBlocks(blocks: displaySegment[], speed: number) {
        if(SoundManager.instance) SoundManager.instance.playSFX("text", {loop: true, autoplay: true});
        let skipped = false;
        for (const { tb, full } of blocks) {
            for (let i = 1; i <= full.length; i++) {
                tb.text = full.slice(0, i);
                if (this._advanceRequested) {
                    skipped = true;
                    break;
                }
                await Utils.sleep(speed);
            }
            if (skipped) break;
        }
        if(SoundManager.instance) SoundManager.instance.stopSFX("text");
    }
}
