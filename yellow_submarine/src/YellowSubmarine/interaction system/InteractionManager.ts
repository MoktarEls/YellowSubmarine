import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class InteractionManager{

    private static _instance: InteractionManager;

    public static get instance(): InteractionManager {
        return this._instance;
    }

    private _interactionArray: Array<AbstractInteraction> = new Array<AbstractInteraction>();
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
        this._interactionArray.push(interaction);
        this._currentInteraction = interaction;
        console.log(interaction);
    }

    public removeAvailableInteraction(){
        this._interactionArray.pop();

        if(this._interactionArray.length > 0){
            this._currentInteraction = this._interactionArray[this._interactionArray.length - 1];
        } else {
            this._currentInteraction = undefined;
        }
    }

    public get currentInteraction(): AbstractInteraction | undefined{
        return this._currentInteraction;
    }

    public executeInteraction(){
        this._currentInteraction?.executeInteraction();
    }

}