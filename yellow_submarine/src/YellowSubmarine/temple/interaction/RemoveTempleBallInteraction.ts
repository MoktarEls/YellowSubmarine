import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {AbstractMesh} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class RemoveTempleBallInteraction extends WorldInteraction{

    public constructor(private _socle: Socle) {
        super();
    }

    public get description(): string {
        return "Retirer";
    }

    public get mesh(): AbstractMesh | undefined {
        return this._socle.mesh;
    }

    protected _onAvailable(): void {
        return;
    }

    protected _onUnavailable(): void {
        return;
    }

    protected _start(): void {
        const templeBall = this._socle.currentBall;
        if(templeBall && !Submarine.instance.templeBall){
            this._socle.letGoOfBall();
            Submarine.instance.grabBall(templeBall);
            console.log("REMOVING THE BALL !!!")
        }
        this.endOnNextFrame();
    }

    protected _end(): void {
        return;
    }



}