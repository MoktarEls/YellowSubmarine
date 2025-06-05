import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";

export class InteractionManager{


    private _availableInteractions: Array<AbstractInteraction> = new Array<AbstractInteraction>();
    private _currentInteraction?: AbstractInteraction;

    public _onInteractionAvailable: Observable<AbstractInteraction> = new Observable();
    public _onInteractionUnavailable: Observable<AbstractInteraction> = new Observable();

    public _onBeforeInteractionStart: Observable<AbstractInteraction> = new Observable();
    public _onAfterInteractionStart: Observable<AbstractInteraction> = new Observable();

    public _onBeforeInteractionEnd: Observable<AbstractInteraction> = new Observable();
    public _onAfterInteractionEnd: Observable<AbstractInteraction> = new Observable();

    public addToAvailableInteraction(interaction: AbstractInteraction){
        throw new Error("Not implemented");
    }

    public removeFromAvailableInteraction(interaction: AbstractInteraction){
        throw new Error("Not implemented");
    }

    public selectNextInteraction(): AbstractInteraction | undefined {
        throw new Error("Not implemented");
    }

    public selectPreviousInteraction(): AbstractInteraction | undefined {
        throw new Error("Not implemented");
    }

    public get selectedInteraction(): AbstractInteraction | undefined {
        throw new Error("Not implemented");
    }

    public startSelectedInteraction(){
        throw new Error("Not implemented");
    }

    public startInteraction(interaction: AbstractInteraction){
        throw new Error("Not implemented");
    }

}