import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";
import {AbstractMesh} from "@babylonjs/core";
import {Grappler} from "@/YellowSubmarine/grappling system/Grappler";

export class GrappleInteraction extends WorldInteraction{

    public constructor(private _grabbableObject: TempleBall) {
        super("KeyF", "F");
    }

    public get grabbableObject(): TempleBall {
        return this._grabbableObject;
    }

    public set grabbableObject(value: TempleBall) {
        this._grabbableObject = value;
    }

    public get description(): string {
        return "Attraper";
    }

    public executeInteraction(): void {
        Grappler.instance.grappleObject(this._grabbableObject);
        this.makeUnavailable();
    }

    public get mesh(): AbstractMesh | undefined {
        return this._grabbableObject.mesh;
    }


}