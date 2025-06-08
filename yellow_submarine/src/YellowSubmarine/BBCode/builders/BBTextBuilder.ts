import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";
import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBStyleBuilder} from "@/YellowSubmarine/BBCode/builders/BBStyleBuilder";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";

export class BBTextBuilder {

    private _segments: BBSegment[] = [];

    public addText(
        styleCtor: BBStyle,
        text: string
    ): BBTextBuilder {
        throw new Error("Not implemented.");
    }

    public build(): BBText{
        return new BBText(this._segments.slice());
    }

    public example(): void{
        const bbText = new BBTextBuilder().addText(
            new BBStyleBuilder().addTag(BoldTag).addTag(ColorTag, "red").addTag(SizeTag, 5).build(),
            "djqslkdjqslkdqlskdjlqskjd"
        )
    }

}