import {Control} from "@babylonjs/gui";

export abstract class UI{

    public abstract get controlNode(): Control;

    public show(): void {
        this.controlNode.isVisible = true;
    }

    public hide(): void {
        this.controlNode.isVisible = false;
    }

}