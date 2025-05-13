import {AdvancedDynamicTexture, Rectangle, TextBlock} from "@babylonjs/gui";
import {AbstractMesh} from "@babylonjs/core";

export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui");

    constructor(mesh: AbstractMesh) {
        const rect1 = new Rectangle();
        rect1.width = 0.2;
        rect1.height = "40px";
        rect1.cornerRadius = 20;
        rect1.color = "Blue";
        rect1.thickness = 4;
        rect1.background = "white";
        this._ui.addControl(rect1);

        const label = new TextBlock();
        label.text = "Submarine";
        rect1.addControl(label);

        rect1.linkWithMesh(mesh);
        rect1.linkOffsetY = -50;
    }


}