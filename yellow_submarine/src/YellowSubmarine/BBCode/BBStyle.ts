import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";

export class BBStyle {

    get tags(): BBTag[] {
        return this._tags.slice();
    }

    constructor(private readonly _tags: BBTag[]) {}

}