import { Utils } from "@/YellowSubmarine/Utils";
import {StyledTextBlock} from "@/YellowSubmarine/ui system/TextLayoutManager";

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

    public async animateBlocks(blocks: StyledTextBlock[], speed: number) {
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
    }
}
