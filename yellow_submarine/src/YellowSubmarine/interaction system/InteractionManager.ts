import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class InteractionManager{

    private static _instance: InteractionManager;

    public static get instance(): InteractionManager {
        return this._instance;
    }

    private _currentInteraction?: AbstractInteraction;

    public onInteractionAvailable: Observable<AbstractInteraction>;
    public onInteractionUnavailable: Observable<AbstractInteraction>;

    constructor() {
        InteractionManager._instance = this;
        this.onInteractionAvailable = new Observable<AbstractInteraction>();
        this.onInteractionUnavailable = new Observable<AbstractInteraction>();
        Game.scene.onKeyboardObservable.add( (eventData) => {

            if(
                eventData.type === KeyboardEventTypes.KEYDOWN &&
                this._currentInteraction &&
                eventData.event.code === this._currentInteraction.code
            ) {
                this.executeInteraction();
            }
        } )
    }

    public addAvailableInteraction(interaction: AbstractInteraction){
        this._currentInteraction = interaction;
    }

    public removeAvailableInteraction(){
        this._currentInteraction = undefined;
    }

    public get currentInteraction(): AbstractInteraction | undefined{
        return this._currentInteraction;
    }

    public executeInteraction(){
        this._currentInteraction?.executeInteraction();
    }

}