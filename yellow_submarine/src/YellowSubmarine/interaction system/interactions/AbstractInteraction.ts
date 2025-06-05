import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {Observable} from "@babylonjs/core";

export abstract class AbstractInteraction {

    private _onAvailableObservable: Observable<void> = new Observable();
    private _onUnavailableObservable: Observable<void> = new Observable();
    private _onStartObservable: Observable<void> = new Observable();
    private _onEndObservable: Observable<void> = new Observable();

    get code(): string {
        return this._code;
    }

    get simplifiedCode(): string {
        return this._simplifiedCode;
    }

    get onAvailableObservable(): Observable<void> {
        return this._onAvailableObservable;
    }

    get onUnavailableObservable(): Observable<void> {
        return this._onUnavailableObservable;
    }

    get onStartObservable(): Observable<void> {
        return this._onStartObservable;
    }

    get onEndObservable(): Observable<void> {
        return this._onEndObservable;
    }

    protected constructor(private _interactionManager: InteractionManager, protected _code: string, protected _simplifiedCode: string) {}

    public makeAvailable(){
        this._interactionManager.addToAvailableInteraction(this);
    }

    public makeUnavailable(){
        this._interactionManager.removeFromAvailableInteraction(this);
    }

    public onAvailable(){
        this._onAvailable();
        this._onAvailableObservable.notifyObservers();
    }

    public onUnavailable(){
        this._onUnavailable();
        this._onUnavailableObservable.notifyObservers();
    }

    public onStart(){
        this._onStart();
        this._onStartObservable.notifyObservers();
    }

    public onEnd(){
        this._onEnd();
        this._onEndObservable.notifyObservers();
    }

    protected abstract _onAvailable(): void;
    protected abstract _onUnavailable(): void;
    protected abstract _onStart(): void;
    protected abstract _onEnd(): void;

}