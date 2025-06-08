import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";

export class BBSegment {

    constructor(
        public readonly text: string,
        public readonly style: BBStyle,
        public readonly textSize: number = 24
    ) {

    }

}