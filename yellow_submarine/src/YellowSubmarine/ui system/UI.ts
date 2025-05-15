import {Control} from "@babylonjs/gui";

export abstract class UI{

    public abstract get controlNode(): Control;
}