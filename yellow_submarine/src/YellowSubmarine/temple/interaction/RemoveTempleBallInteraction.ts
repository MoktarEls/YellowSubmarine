import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {AbstractMesh} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class RemoveTempleBallInteraction extends WorldInteraction{

    public constructor(private _socle: Socle) {
        super("KeyF");
    }

    public get description(): string {
        return "Remove the ball";
    }

    executeInteraction(): void {
        const templeBall = this._socle.currentBall;
        if(templeBall && !Submarine.instance.templeBall){
            this._socle.letGoOfBall();
            Submarine.instance.grabBall(templeBall);
            console.log("REMOVING THE BALL !!!")
        }
    }

    public get mesh(): AbstractMesh | undefined {
        return this._socle.mesh;
    }



}