import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";

export class InteractionManager{

    private static _instance: InteractionManager;

    public static get instance(): InteractionManager {
        return this._instance;
    }

    // private _interactionArray: Array<AbstractInteraction> = new Array<AbstractInteraction>();
    private _currentInteraction?: AbstractInteraction;

    public onInteractionAvailable: Observable<AbstractInteraction>;
    public onInteractionUnavailable: Observable<AbstractInteraction>;

    constructor() {
        InteractionManager._instance = this;
        this.onInteractionAvailable = new Observable<AbstractInteraction>();
        this.onInteractionUnavailable = new Observable<AbstractInteraction>();
        Player.onPlayerPressedAKey.add( (eventData) => {

            if(
                eventData.type === KeyboardEventTypes.KEYDOWN &&
                this._currentInteraction &&
                eventData.event.code === this._currentInteraction.code
            ) {
                this.executeInteraction();
            }
        } )
    }

    public makeInteractionAvailable(interaction: AbstractInteraction){
        if(this._currentInteraction) {
            this.makeInteractionUnavailable(this._currentInteraction);
        }
        this._currentInteraction = interaction;
        this.onInteractionAvailable.notifyObservers(interaction);
    }

    public makeInteractionUnavailable(interaction: AbstractInteraction){
        this.onInteractionUnavailable.notifyObservers(interaction);
        this._currentInteraction = undefined;
    }

    public executeInteraction(){
        const interaction = this._currentInteraction;
        if(interaction){
            interaction.executeInteraction();
        }
    }

}