import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {AbstractMesh} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class PlaceTempleBallInteraction extends WorldInteraction{

    public constructor(private _socle: Socle) {
        super("KeyF", "F");
    }

    public get description(): string {
        return "Place";
    }

    executeInteraction(): void {
        const templeBall = Submarine.instance.templeBall;
        if(templeBall) {
            console.log("PLACING THE BALL !!!", templeBall);
            this._socle.placeBall(templeBall);
            Submarine.instance.letGoOfBall();
        }
    }

    public get mesh(): AbstractMesh | undefined {
        return this._socle.mesh;
    }

}