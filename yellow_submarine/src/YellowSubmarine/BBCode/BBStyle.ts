import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {NullTag} from "@/YellowSubmarine/BBCode/tags/NullTag";

export class BBStyle {

    static NULL_STYLE: BBStyle = new BBStyle([new NullTag()]);

    get tags(): BBTag[] {
        return this._tags.slice();
    }

    constructor(private readonly _tags: BBTag[]) {}

}