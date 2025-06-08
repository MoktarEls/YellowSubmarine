import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";

export class BBText {

    public get segments() {
        return this._segments.slice();
    }

    constructor(private _segments: BBSegment[]) {}

}