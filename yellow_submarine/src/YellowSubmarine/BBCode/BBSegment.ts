import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";

export class BBSegment {

    private static DEFAULT_TEXT_SIZE = 24;
    private static DEFAULT_COLOR = "black";

    public get numberOfSpacesOnTheLeft(): number{
            const trimedText = this.text.trim();
            const trimedRightText = this.text.trimStart();
            return trimedRightText.length - trimedText.length;
    }

    public get numberOfSpacesOnTheRight(): number{
        const trimedText = this.text.trim();
        const trimedLeftText = this.text.trimEnd();
        return trimedLeftText.length - trimedText.length;
    }

    public get fontSize() {
        return (this.style.tags.find( (tag) => tag instanceof SizeTag )as SizeTag | undefined)?.size ?? BBSegment.DEFAULT_TEXT_SIZE;
    }

    public get color(): string {
        return (this.style.tags.find( (tag) => tag instanceof ColorTag )as ColorTag | undefined)?.color ?? BBSegment.DEFAULT_COLOR;
    }

    constructor(
        public readonly text: string,
        public readonly style: BBStyle,
    ) {}

}