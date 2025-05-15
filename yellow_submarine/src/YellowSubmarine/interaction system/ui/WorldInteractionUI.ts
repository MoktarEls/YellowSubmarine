import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock} from "@babylonjs/gui";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export class WorldInteractionUI extends UI{

    private _textBlock: TextBlock;

    constructor() {
        super();
        this._textBlock = new TextBlock();
        InteractionManager.instance.onInteractionAvailable.add((interaction) => {
            if(interaction instanceof WorldInteraction) {
                this.show(interaction);
            }
        });
        InteractionManager.instance.onInteractionUnavailable.add((interaction) => {
            if(interaction instanceof WorldInteraction) {
                this.hide();
            }
        });
    }

    public get controlNode(): Control {
        return this._textBlock;
    }

    private show(interaction: WorldInteraction): void {
        this._textBlock.isVisible = true;
        this._textBlock.text = `${interaction.code} : ${interaction.description}`;
        this._textBlock.linkWithMesh(interaction.mesh ?? null);
        this._textBlock.linkOffsetY = "-150px";
    }

    private hide() {
        this._textBlock.isVisible = false;
        this._textBlock.linkWithMesh(null);
    }
}