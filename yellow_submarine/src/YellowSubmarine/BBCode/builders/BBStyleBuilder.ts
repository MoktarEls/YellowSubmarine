import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";
import {CtorArgsChain} from "@/YellowSubmarine/Utils";
import {DefaultStyleTag} from "@/YellowSubmarine/BBCode/tags/DefaultStyleTag";

export class BBStyleBuilder {

    public static fromTagsAndArgs<
        T extends unknown[]
    >
    (
        ...args: CtorArgsChain<BBTag,T>
    ): BBStyle {
        let currentIndex = 0;
        const bbTags = [new DefaultStyleTag()];
        while (currentIndex < args.length) {
            const ctor = args[currentIndex] as (new (...args: any[]) => any);
            const numberOfParams = ctor.length;
            const ctorArgs = args.slice(currentIndex + 1, currentIndex + 1 + numberOfParams);
            const bbTag = new ctor(ctorArgs) as BBTag;
            bbTags.push(bbTag);
            currentIndex += numberOfParams + 1;
        }
        return new BBStyle(bbTags);
    }

}