import {BBSegment} from "@/YellowSubmarine/BBCode/BBSegment";

export class BBText {

    public get segments() {
        return this._segments.slice();
    }

    public get textAsString(){
        let text = "";
        for(let i=0; i<this._segments.length; i++){
            text += this._segments[i].text + " ";
        }
        return text;
    }

    constructor(private _segments: BBSegment[]) {}

}