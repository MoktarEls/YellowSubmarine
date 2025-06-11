import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Container, Control, Rectangle, StackPanel} from "@babylonjs/gui";
import {World} from "@/YellowSubmarine/World";
import {KeyUI} from "@/YellowSubmarine/interaction system/ui/KeyUI";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {BBTextBlock} from "@/YellowSubmarine/BBCode/custom node/BBTextBlock";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {SizeTag} from "@/YellowSubmarine/BBCode/tags/SizeTag";

export class WorldInteractionUI extends UI{

    private _hContainer: StackPanel;
    private _inputsUiContainer: StackPanel;
    private _worldInteractionUiContainer: Rectangle;
    private _bbTextBlock: BBTextBlock;

    private _selectNextUi: KeyUI;
    private _selectUi: KeyUI;
    private _selectPreviousUi: KeyUI;

    private _availableWorldInteractions: WorldInteraction[] = [];

    public get controlNode(): Control {
        return this._hContainer;
    }

    constructor() {
        super();
        this._hContainer = new StackPanel();
        this._hContainer.isVertical = false;
        this._hContainer.width = "150px"
        this._hContainer.height = "100px"
        Submarine.instance.meshCreationPromise.then( (mesh) => {
            this._hContainer.linkWithMesh(mesh);
            this._hContainer.linkOffsetY = "-10%";
        })

        this._bbTextBlock = new BBTextBlock();
        this._worldInteractionUiContainer = new Rectangle();
        this._worldInteractionUiContainer.width = "80%"
        this._worldInteractionUiContainer.height = "100%"
        this._worldInteractionUiContainer.color = "rgb(168, 98, 68)";
        this._worldInteractionUiContainer.thickness = 4;
        this._worldInteractionUiContainer.background = "rgb(255, 199, 130)";
        this._worldInteractionUiContainer.addControl(this._bbTextBlock.controlNode);

        this._hContainer.addControl(this._worldInteractionUiContainer);

        this._inputsUiContainer = new StackPanel();
        this._inputsUiContainer.isVertical = true;
        this._inputsUiContainer.width = "20%";
        this._inputsUiContainer.height = "100%";
        this._hContainer.addControl(this._inputsUiContainer);

        this._selectNextUi = new KeyUI("🖱️▲");
        this._selectUi = new KeyUI(WorldInteraction.simplifiedCode);
        this._selectPreviousUi = new KeyUI("🖱️▼");

        this._inputsUiContainer.addControl(this._selectNextUi.controlNode);
        this._inputsUiContainer.addControl(this._selectUi.controlNode);
        this._inputsUiContainer.addControl(this._selectPreviousUi.controlNode);

        World.instance.worldInteractionManager.onInteractionAvailable.add( (worldInteraction) => {
            this._availableWorldInteractions.push(worldInteraction);
            this.updateVisibility();
        })

        World.instance.worldInteractionManager.onInteractionUnavailable.add( (worldInteraction) => {
            this._availableWorldInteractions.splice(this._availableWorldInteractions.indexOf(worldInteraction), 1);
            this.updateVisibility();
        })

        World.instance.worldInteractionManager.onInteractionSelected.add( (worldInteraction) => {
            this._bbTextBlock.bbText = new BBTextBuilder().addText(worldInteraction.description, SizeTag, 30).build();
        })

        this.hide();
    }

    private updateVisibility() {
        if(this._availableWorldInteractions.length <= 0){
            this.hide();
        }else{
            this.show();
            if(this._availableWorldInteractions.length == 1){
                this._selectPreviousUi.hide()
                this._selectNextUi.hide()
            }
            else{
                this._selectPreviousUi.show()
                this._selectNextUi.show()
            }

        }
    }
}