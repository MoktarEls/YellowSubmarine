import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {Observable} from "@babylonjs/core";

export abstract class InteractionManager<TInteraction extends AbstractInteraction>{

    private _availableInteractions: TInteraction[] = [];
    private _selectedInteraction? : TInteraction;

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
        return this._selectedInteraction;
    }

    get availableInteractions(): TInteraction[] {
        return this._availableInteractions.slice(0);
    }

    public addToAvailableInteraction(interaction: TInteraction){
        if(this.isInteractionUnavailable(interaction)){
            this._availableInteractions.push(interaction);
            this._onInteractionAvailable.notifyObservers(interaction);
            if(!this._selectedInteraction){
                this.selectInteraction(interaction);
            }
        }
    }

    public removeFromAvailableInteraction(interaction: TInteraction){
        if(this.isInteractionAvailable(interaction)){
            if(this._selectedInteraction === interaction){
                this._selectedInteraction = undefined;
                this._onInteractionUnselected.notifyObservers(interaction);
            }
            this._availableInteractions.splice(this._availableInteractions.indexOf(interaction), 1);
            this._onInteractionUnavailable.notifyObservers(interaction);
        }
    }

    public selectNextInteraction(): TInteraction | undefined {
        return this.selectInteractionWithDelta(1);
    }

    public selectPreviousInteraction(): TInteraction | undefined {
        return this.selectInteractionWithDelta(-1);

    }

    public selectInteraction(newInteraction: TInteraction){
        if(this.isInteractionAvailable(newInteraction)){
            const currentlySelectedInteraction = this._selectedInteraction;
            if(currentlySelectedInteraction == newInteraction){
                this._selectedInteraction = undefined;
                this._onInteractionUnselected.notifyObservers(currentlySelectedInteraction);
            }
            this._selectedInteraction = newInteraction;
            this._onInteractionSelected.notifyObservers(newInteraction);
            return newInteraction;
        }
        else{
            throw new Error(`The interaction : ${newInteraction} can't be selected because, it is not available in the interaction manager : ${this}`);
        }
    }

    public startSelectedInteraction(){
        if(this._inProgressInteraction){
            throw new Error(`The selected interaction can't be started because an interaction is already in progress`)
        }

        if(!this._selectedInteraction){
            throw new Error(`The selected interaction can't be started because no interaction is selected.`);
        }

        this._inProgressInteraction = this._selectedInteraction;
        this._inProgressInteraction.onStartedObservable.addOnce(() => {
            this._onInteractionStarted.notifyObservers(this._inProgressInteraction as TInteraction);
        })
        this._inProgressInteraction.onEndedObservable.addOnce( () => {
            const endedInteraction = this._inProgressInteraction as TInteraction;
            this._inProgressInteraction = undefined;
            this._onInteractionEnded.notifyObservers(endedInteraction as TInteraction);
        })
        this._inProgressInteraction.start();
    }

    public startInteraction(interaction: TInteraction){
        if(this.isInteractionUnavailable(interaction)){
            throw new Error(`The interaction : ${interaction} can't be started because it is not registered in the interaction manager : ${this}`)
        }

        if(this._inProgressInteraction){
            throw new Error(`The interaction : ${interaction} can't be started because an interaction is already in progress`);
        }

        this.selectInteraction(interaction);
        this.startSelectedInteraction();
    }

    // ---------------------------------------------P R I V A T E---------------------------------------------------- //

    private isInteractionAvailable(interaction: TInteraction): boolean {
        return this._availableInteractions.includes(interaction);
    }

    private isInteractionUnavailable(interaction: TInteraction): boolean {
        return !this.isInteractionAvailable(interaction);
    }

    private wrapIndex(index: number){
        return ((index % this._availableInteractions.length) + this._availableInteractions.length) % this._availableInteractions.length;
    }

    private selectInteractionWithDelta(delta: number){
        const currentlySelectedInteraction = this._selectedInteraction;
        if (currentlySelectedInteraction) {
            const indexOfCurrentInteraction = this._availableInteractions.indexOf(currentlySelectedInteraction);
            const index = this.wrapIndex(indexOfCurrentInteraction - delta);
            this._selectedInteraction = undefined;
            this._onInteractionUnselected.notifyObservers(currentlySelectedInteraction);
            const newInteraction = this._availableInteractions[index];
            this._selectedInteraction = newInteraction;
            this._onInteractionSelected.notifyObservers(newInteraction);
            return newInteraction;
        }
        else if(this._availableInteractions.length > 0){
            const newInteraction = this._availableInteractions[delta > 0 ? 0 : this._availableInteractions.length - 1];
            this._selectedInteraction = newInteraction;
            this._onInteractionSelected.notifyObservers(newInteraction);
            return newInteraction;
        }
        return undefined;
    }

}