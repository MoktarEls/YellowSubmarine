/*
import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export class WorldInteractionUI extends UI{

    private _container: Rectangle;

    constructor() {
        super();
        this._container = new Rectangle();
        this._container.width = "300px";
        this._container.height = "200px";
        this._container.thickness = 0;
        this._container.scaleY = 0.5;
        this._container.scaleX = 0.5;

        InteractionManager.instance.onInteractionAvailable.add((interaction) => {
            if(interaction instanceof WorldInteraction) {
                this.display(interaction);
            }
        });
        InteractionManager.instance.onInteractionUnavailable.add((interaction) => {
            if(interaction instanceof WorldInteraction) {
                this.hide();
                this._container.linkWithMesh(null);
            }
        });
    }

    public get controlNode(): Control {
        return this._container;
    }

    private display(interaction: WorldInteraction): void {
        this._container.isVisible = true;

        const rec1 = new Rectangle();
        rec1.width = "180px";
        rec1.height = "60px";
        rec1.cornerRadius = 60;
        rec1.color = "rgb(168, 98, 68)";
        rec1.thickness = 4;
        rec1.background = "rgb(255, 199, 130)";
        this._container.addControl(rec1);

        const label1 = new TextBlock();
        label1.fontSize = 30;
        label1.text = `${interaction.description}`;
        rec1.addControl(label1);

        // Deuxième rectangle avec son label
        const rec2 = new Rectangle();
        rec2.width = "80px";
        rec2.height = "70px";
        rec2.cornerRadius = 60;
        rec2.color = "rgb(168, 98, 68)";
        rec2.thickness = 4;
        rec2.background = "rgb(255, 255, 255)";
        rec2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rec2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._container.addControl(rec2);

        const label2 = new TextBlock();
        label2.fontSize = 45;
        label2.text = `${interaction.simplifiedCode}`;
        label2.fontWeight = "bold";
        label2.paddingTop = "6px";
        rec2.addControl(label2);

        this._container.linkWithMesh(interaction.mesh ?? null);
        this._container.linkOffsetY = "-50px";

    }

}*/
