import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {NullTag} from "@/YellowSubmarine/BBCode/tags/NullTag";

export class BBStyle {

    get tags(): BBTag[] {
        return this._tags.slice();
    }

    constructor(private readonly _tags: BBTag[]) {}

}