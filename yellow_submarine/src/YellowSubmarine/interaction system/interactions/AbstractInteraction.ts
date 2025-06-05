import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {Observable} from "@babylonjs/core";

export abstract class AbstractInteraction {

    private _onAvailableObservable: Observable<void> = new Observable();
    private _onUnavailableObservable: Observable<void> = new Observable();
    private _onBeforeStartObservable: Observable<void> = new Observable();
    private _onAfterStartObservable: Observable<void> = new Observable();
    private _onBeforeEndObservable: Observable<void> = new Observable();
    private _onAfterEndObservable: Observable<void> = new Observable();

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

    get onBeforeStartObservable(): Observable<void> {
        return this._onBeforeStartObservable;
    }

    get onAfterStartObservable(): Observable<void> {
        return this._onAfterStartObservable;
    }

    get onBeforeEndObservable(): Observable<void> {
        return this._onBeforeEndObservable;
    }

    get onAfterEndObservable(): Observable<void> {
        return this._onAfterEndObservable;
    }

    protected constructor(protected _code: string, protected _simplifiedCode: string) {}

    public onAvailable(){
        this._onAvailable();
        this._onAvailableObservable.notifyObservers();
    }

    public onUnavailable(){
        this._onUnavailable();
        this._onUnavailableObservable.notifyObservers();
    }

    public start(){
        this._onBeforeStartObservable.notifyObservers();
        this._onStart();
        this._onAfterStartObservable.notifyObservers();
    }

    protected end(){
        this._onBeforeEndObservable.notifyObservers();
        this._onEnd();
        this._onAfterEndObservable.notifyObservers();
    }

    protected abstract _onAvailable(): void;
    protected abstract _onUnavailable(): void;
    protected abstract _onStart(): void;
    protected abstract _onEnd(): void;

}