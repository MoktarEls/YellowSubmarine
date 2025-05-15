import {IslandInteraction} from "@/YellowSubmarine/interaction system/interactions/IslandInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, TextBlock} from "@babylonjs/gui";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export class IslandsUI extends UI<IslandInteraction>{

    private _textBlock: TextBlock;

    get controlNode(): Control {
        return this._textBlock;
    }

    constructor() {
        super();
        this._textBlock = new TextBlock();
        InteractionManager.instance.onInteractionAvailable.add( (interaction) => {
            if(interaction instanceof IslandInteraction) {
                this.show(interaction);
            }
        })
    }

    private show(interaction: IslandInteraction) {
        this._textBlock.isVisible = true;
        this._textBlock.text = interaction.name;

        this._textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._textBlock.paddingLeft = "20px";
        this._textBlock.paddingBottom = "20px";

        this._textBlock.color = "white";
        this._textBlock.fontSize = "24px";
        this._textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        setTimeout(() => {
            this._textBlock.isVisible = false;
        }, 3000);
    }




}