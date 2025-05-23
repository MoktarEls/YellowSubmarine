import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {GrabbableObject} from "@/YellowSubmarine/grappling system/GrabbableObject";
import {AbstractMesh} from "@babylonjs/core";
import {Grappler} from "@/YellowSubmarine/grappling system/Grappler";

export class GrappleInteraction extends WorldInteraction{

    public constructor(private _grabbableObject: GrabbableObject) {
        super("KeyF");
    }

    public get grabbableObject(): GrabbableObject {
        return this._grabbableObject;
    }

    public set grabbableObject(value: GrabbableObject) {
        this._grabbableObject = value;
    }

    public get description(): string {
        return "Grapple";
    }

    public executeInteraction(): void {
        Grappler.instance.grappleObject(this._grabbableObject);
        this.makeUnavailable();
    }

    public get mesh(): AbstractMesh | undefined {
        return this._grabbableObject.mesh;
    }


}