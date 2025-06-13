import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {World} from "@/YellowSubmarine/World";
import {KeyUI} from "@/YellowSubmarine/interaction system/ui/KeyUI";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {WorldInteractionManager} from "@/YellowSubmarine/world interaction system/interaction/WorldInteractionManager";

export class WorldInteractionUI extends UI{

    private _container: Rectangle;
    private _keyUi: KeyUI;
    private _label: TextBlock;

    constructor() {
        super();
        this._container = new Rectangle();
        this._container.width = "300px";
        this._container.height = "200px";
        this._container.thickness = 0;
        this._container.scaleY = 0.5;
        this._container.scaleX = 0.5;

        const rec1 = new Rectangle();
        rec1.width = "180px";
        rec1.height = "60px";
        rec1.cornerRadius = 60;
        rec1.color = "rgb(168, 98, 68)";
        rec1.thickness = 4;
        rec1.background = "rgb(255, 199, 130)";
        this._container.addControl(rec1);

        this._label = new TextBlock();
        this._label.fontSize = 30;
        rec1.addControl(this._label);

        this._keyUi = new KeyUI(WorldInteractionManager.startInteractionInput.simplifiedCode);
        this._keyUi.controlNode.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._keyUi.controlNode.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._container.addControl(this._keyUi.controlNode);

        World.instance.worldInteractionManager.onInteractionAvailable.add((interaction) => {
            this.display(interaction);
        });
        World.instance.worldInteractionManager.onInteractionUnavailable.add((interaction) => {
            this.hide();
            this._container.linkWithMesh(null);
        });

        World.instance.worldInteractionManager.onInteractionStarted.add((interaction) => {
            this.hide();
        })

        World.instance.worldInteractionManager.onInteractionEnded.add((interaction) => {
            if(World.instance.worldInteractionManager.availableInteractions.length > 0){
                this.show();
            }
            else{
                this.hide();
            }
        })

    }

    public get controlNode(): Control {
        return this._container;
    }

    private display(interaction: WorldInteraction): void {
        this._label.text = `${interaction.description}`
        this._container.linkWithMesh(interaction.mesh ?? null);
        this._container.linkOffsetY = "-50px";
        this._container.isVisible = true;
    }

}
