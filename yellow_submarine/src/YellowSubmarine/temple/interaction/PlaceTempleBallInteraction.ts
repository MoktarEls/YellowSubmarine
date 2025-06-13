import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {AbstractMesh} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class PlaceTempleBallInteraction extends WorldInteraction{

    public constructor(private _socle: Socle) {
        super();
    }

    public get description(): string {
        return "Poser";
    }

    public get mesh(): AbstractMesh | undefined {
        return this._socle.mesh;
    }

    protected onStart(): void {
        const templeBall = Submarine.instance.templeBall;
        if(templeBall) {
            this._socle.placeBall(templeBall);
            Submarine.instance.letGoOfBall();
        }
        this.end();
    }

}