import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Control} from "@babylonjs/gui";

export abstract class UI<T extends AbstractInteraction>{

    public abstract get controlNode(): Control;
}