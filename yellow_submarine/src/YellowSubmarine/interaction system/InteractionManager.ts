import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";

export class InteractionManager<TInteraction extends AbstractInteraction>{

    private _availableInteractions: Array<TInteraction> = new Array<TInteraction>();
    private _selectedInteractionIndex = -1;

    private _onInteractionAvailable: Observable<TInteraction> = new Observable();
    private _onInteractionUnavailable: Observable<TInteraction> = new Observable();

    private _onBeforeInteractionStart: Observable<TInteraction> = new Observable();
    private _onAfterInteractionStart: Observable<TInteraction> = new Observable();

    private _onBeforeInteractionEnd: Observable<TInteraction> = new Observable();
    private _onAfterInteractionEnd: Observable<TInteraction> = new Observable();

    private _inProgressInteraction?: TInteraction;

    get onInteractionAvailable(): Observable<TInteraction> {
        return this._onInteractionAvailable;
    }

    get onInteractionUnavailable(): Observable<TInteraction> {
        return this._onInteractionUnavailable;
    }

    get onBeforeInteractionStart(): Observable<TInteraction> {
        return this._onBeforeInteractionStart;
    }

    get onAfterInteractionStart(): Observable<TInteraction> {
        return this._onAfterInteractionStart;
    }

    get onBeforeInteractionEnd(): Observable<TInteraction> {
        return this._onBeforeInteractionEnd;
    }

    get onAfterInteractionEnd(): Observable<TInteraction> {
        return this._onAfterInteractionEnd;
    }

    get selectedInteraction(): TInteraction | undefined {
        if(this._selectedInteractionIndex >= 0 && this._selectedInteractionIndex < this._availableInteractions.length) {
            return this._availableInteractions[this._selectedInteractionIndex];
        }
        return undefined;
    }

    public addToAvailableInteraction(interaction: TInteraction){
        if(!this._availableInteractions.includes(interaction)){
            this._availableInteractions.push(interaction);
        }
    }

    public removeFromAvailableInteraction(interaction: TInteraction){
        if(this._availableInteractions.includes(interaction)){
            const index = this._availableInteractions.indexOf(interaction);
            this._availableInteractions.splice(index, 1);
        }
    }

    public selectNextInteraction(): TInteraction | undefined {
        return this.selectInteractionAtIndex(++this._selectedInteractionIndex);
    }

    public selectPreviousInteraction(): TInteraction | undefined {
        return this.selectInteractionAtIndex(--this._selectedInteractionIndex);
    }

    public selectInteraction(interaction: TInteraction): boolean{
        const interactionIsAvailable = this._availableInteractions.includes(interaction);
        if(!interactionIsAvailable){
            return false;
        }
        const index = this._availableInteractions.indexOf(interaction);
        this.selectInteractionAtIndex(index);
        return true;

    }

    private selectInteractionAtIndex(index: number): TInteraction | undefined{
        this._selectedInteractionIndex = index;
        this.clampSelectedInteractionIndex();

        if(this._availableInteractions.length === 0){
            return undefined;
        }
        else{
            return this._availableInteractions[this._selectedInteractionIndex];
        }
    }

    private clampSelectedInteractionIndex(){
        if(this._selectedInteractionIndex >= this._availableInteractions.length){
            this._selectedInteractionIndex = 0;
        }
        else if(this._selectedInteractionIndex < 0){
            this._selectedInteractionIndex = this._availableInteractions.length - 1;
        }
    }

    private isAnInteractionInProgress(): boolean{
        return this._inProgressInteraction !== undefined;
    }

    public startSelectedInteraction(){
        const selectedInteraction = this.selectedInteraction;
        if(selectedInteraction){
            this.startInteraction(selectedInteraction);
        }
        else{
            throw new Error('Tried to start selected interaction but was undefined');
        }
    }

    public startInteraction(interaction: TInteraction){
        if(this.isAnInteractionInProgress()){
            throw new Error("An interaction is already in progress");
        }
        this._inProgressInteraction = interaction;
        interaction.onBeforeStartObservable.addOnce(() => this.beforeInteractionStart(interaction));
        interaction.onAfterStartObservable.addOnce(() => this.afterInteractionStart(interaction));
        interaction.onBeforeEndObservable.addOnce(() => this.beforeInteractionEnd(interaction));
        interaction.onAfterEndObservable.addOnce(() => this.afterInteractionEnd(interaction));
        this._onBeforeInteractionStart.notifyObservers(interaction);
    }

    private beforeInteractionStart(interaction: TInteraction){
        this._inProgressInteraction = interaction;
        this._onBeforeInteractionStart.notifyObservers(interaction);
        this._inProgressInteraction.start();
    }

    private afterInteractionStart(interaction: TInteraction){
        this._onAfterInteractionStart.notifyObservers(interaction);
    }

    private beforeInteractionEnd(interaction: TInteraction){
        this._onBeforeInteractionEnd.notifyObservers(interaction);
    }

    private afterInteractionEnd(interaction: TInteraction){
        this._onAfterInteractionEnd.notifyObservers(interaction);
        this._inProgressInteraction = undefined;
    }

}