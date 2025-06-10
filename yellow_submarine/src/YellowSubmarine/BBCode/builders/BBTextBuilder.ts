import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";
import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {CtorArgsChain} from "@/YellowSubmarine/Utils";
import {BBStyleBuilder} from "@/YellowSubmarine/BBCode/builders/BBStyleBuilder";

export class BBTextBuilder {

    private _segments: BBSegment[] = [];

    public addText<
        T extends unknown[]
    >(
        text: string,
        ...bbStyleArgs: CtorArgsChain<BBTag, T>
    ): BBTextBuilder {
        this._segments.push(new BBSegment(text, BBStyleBuilder.fromTagsAndArgs(...bbStyleArgs)) );
        return this;
    }

    public build(): BBText{
        return new BBText(this._segments.slice());
    }

}