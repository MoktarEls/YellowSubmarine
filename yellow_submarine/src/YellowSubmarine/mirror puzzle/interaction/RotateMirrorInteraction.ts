import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";
import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";

export class RotateMirrorInteraction extends WorldInteraction{

    constructor(private _mirror: Mirror) {
        super();
    }

    get description(): string {
        return "Rotate mirror";
    }

    get mesh(): AbstractMesh | undefined {
        return this._mirror.mesh;
    }

    protected onStart(): void {
        this.end();
        throw new Error("Rotate mirror not implemented.");
    }

}