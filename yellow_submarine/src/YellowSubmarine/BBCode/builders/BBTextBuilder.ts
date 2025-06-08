import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {Control, TextBlock} from "@babylonjs/gui";
import {NullTag} from "@/YellowSubmarine/BBCode/tags/NullTag";

export class BBTextBuilder {

    private _segments: BBSegment[] = [];

    public addText(
        text: string,
        bbStyle?: BBStyle,
    ): BBTextBuilder {
        this._segments.push(new BBSegment(text, bbStyle ??  BBStyle.NULL_STYLE) );
        return this;
    }

    public build(): BBText{
        return new BBText(this._segments.slice());
    }

}