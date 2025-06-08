import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control} from "@babylonjs/gui";
import {BBTextBlock} from "@/YellowSubmarine/BBCode/custom node/BBTextBlock";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {BBStyleBuilder} from "@/YellowSubmarine/BBCode/builders/BBStyleBuilder";
import {ColorTag} from "@/YellowSubmarine/BBCode/tags/ColorTag";
import {BoldTag} from "@/YellowSubmarine/BBCode/tags/BoldTag";
import {ItalicTag} from "@/YellowSubmarine/BBCode/tags/ItalicTag";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";

export class BBTextBlockTestUI extends UI{

    private _bbTextBlock: BBTextBlock;

    constructor() {
        super();
        this._bbTextBlock = new BBTextBlock(new BBTextBuilder()
            .addText("bonjour", new BBStyleBuilder().addTag(BoldTag).build())
            .addText("aurevoir", new BBStyleBuilder().addTag(ItalicTag).addTag(SizeTag, 8).build())
            .addText("no more style")
            .build())
        console.log(this._bbTextBlock);
    }

    get controlNode(): Control {
        return this._bbTextBlock.controlNode;
    }



}