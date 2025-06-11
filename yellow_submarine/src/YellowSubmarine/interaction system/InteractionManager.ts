import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";

export class InteractionManager<TInteraction extends AbstractInteraction>{

    private _availableInteractions: Array<TInteraction> = new Array<TInteraction>();
    private _selectedInteractionIndex = 0;

    private _onInteractionAvailable: Observable<TInteraction> = new Observable();
    private _onInteractionUnavailable: Observable<TInteraction> = new Observable();

    private _onInteractionStarted: Observable<TInteraction> = new Observable();
    private _onInteractionEnded: Observable<TInteraction> = new Observable();

    private _onInteractionSelected: Observable<TInteraction> = new Observable();
    private _onInteractionUnselected: Observable<TInteraction> = new Observable();

    private _inProgressInteraction?: TInteraction;

    get onInteractionAvailable(): Observable<TInteraction> {
        return this._onInteractionAvailable;
    }

    get onInteractionUnavailable(): Observable<TInteraction> {
        return this._onInteractionUnavailable;
    }

    get onInteractionStarted(): Observable<TInteraction> {
        return this._onInteractionStarted;
    }

    get onInteractionEnded(): Observable<TInteraction> {
        return this._onInteractionEnded;
    }

    get onInteractionSelected(): Observable<TInteraction> {
        return this._onInteractionSelected;
    }

    get onInteractionUnselected(): Observable<TInteraction> {
        return this._onInteractionUnselected;
    }

    get selectedInteraction(): TInteraction | undefined {
        if(this._selectedInteractionIndex >= 0 && this._selectedInteractionIndex < this._availableInteractions.length) {
            return this._availableInteractions[this._selectedInteractionIndex];
        }
        return undefined;
    }

    get availableInteractions(): Array<TInteraction> {
        return this._availableInteractions.slice(0);
    }

    public addToAvailableInteraction(interaction: TInteraction){
        if(!this._availableInteractions.includes(interaction)){
            this._availableInteractions.push(interaction);
            this._onInteractionAvailable.notifyObservers(interaction);
        }
    }

    public removeFromAvailableInteraction(interaction: TInteraction){
        if(this._availableInteractions.includes(interaction)){
            if(this.selectedInteraction === interaction){
                this.selectNextInteraction();
            }
            const index = this._availableInteractions.indexOf(interaction);
            this._availableInteractions.splice(index, 1);
            this.onInteractionUnavailable.notifyObservers(interaction);
        }
    }

    public selectNextInteraction(): TInteraction | undefined {
        const oldSelectedInteraction = this.selectedInteraction;
        if(oldSelectedInteraction){
            this._onInteractionUnselected.notifyObservers(oldSelectedInteraction);
        }
        this._selectedInteractionIndex++;
        const newSelectedInteraction = this.selectedInteraction;
        if(newSelectedInteraction){
            this._onInteractionSelected.notifyObservers(newSelectedInteraction);
        }
        return this.selectInteractionAtIndex(++this._selectedInteractionIndex);
    }

    public selectPreviousInteraction(): TInteraction | undefined {
        const oldSelectedInteraction = this.selectedInteraction;
        if(oldSelectedInteraction){
            this._onInteractionUnselected.notifyObservers(oldSelectedInteraction);
        }
        this._selectedInteractionIndex--;
        const newSelectedInteraction = this.selectedInteraction;
        if(newSelectedInteraction){
            this._onInteractionSelected.notifyObservers(newSelectedInteraction);
        }
        return this.selectInteractionAtIndex(++this._selectedInteractionIndex);    }

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
            console.log(`Starting interaction, ${selectedInteraction}`)
            this.startInteraction(selectedInteraction);
        }
        else{
            throw new Error('Tried to start selected interaction but was undefined');
        }
    }

    public startInteraction(interaction: TInteraction){
        if(this.isAnInteractionInProgress()){
            console.log(`An interaction is already in progress`);
            return;
        }
        this._inProgressInteraction = interaction;
        interaction.onStartedObservable.addOnce(() => this.afterInteractionStart(interaction));
        interaction.onEndedObservable.addOnce(() => this.afterInteractionEnd(interaction));
        interaction.start()
    }

    private afterInteractionStart(interaction: TInteraction){
        this._onInteractionStarted.notifyObservers(interaction);
    }

    private afterInteractionEnd(interaction: TInteraction){
        this._onInteractionEnded.notifyObservers(interaction);
        this._inProgressInteraction = undefined;
    }

}