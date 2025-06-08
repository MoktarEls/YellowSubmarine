import {BBTag} from "@/YellowSubmarine/BBCode/BBTag";
import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";

export class BBStyleBuilder {

    private _tags: BBTag[] = [];

    public addTag<
        TagCtor extends new (...args: any[]) => TagType,
        TagType extends BBTag = InstanceType<TagCtor>,
    >
    (
        tagCtor: TagCtor,
        ...tagArgs: ConstructorParameters<TagCtor>
    ): BBStyleBuilder{
        const newTag = new tagCtor(tagArgs);
        this._tags.push(newTag);
        return this;
    }

    public build(): BBStyle{
        return new BBStyle(this._tags.slice());
    }

}