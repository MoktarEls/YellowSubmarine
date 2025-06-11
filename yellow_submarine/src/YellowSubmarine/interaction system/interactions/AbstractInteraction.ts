import {Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export abstract class AbstractInteraction {

    private _onAvailableObservable: Observable<void> = new Observable();
    private _onUnavailableObservable: Observable<void> = new Observable();
    private _onStartedObservable: Observable<void> = new Observable();
    private _onEndedObservable: Observable<void> = new Observable();

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

    get onStartedObservable(): Observable<void> {
        return this._onStartedObservable;
    }

    get onEndedObservable(): Observable<void> {
        return this._onEndedObservable;
    }

    protected _code: string;

    protected _simplifiedCode: string;

    protected constructor(code?: string, simplifiedCode?: string) {
        this._code = code ?? "";
        this._simplifiedCode = simplifiedCode ?? "";
    }

    public onAvailable(){
        this._onAvailable();
        this._onAvailableObservable.notifyObservers();
    }

    public onUnavailable(){
        this._onUnavailable();
        this._onUnavailableObservable.notifyObservers();
    }

    public start(){
        this._start();
        this._onStartedObservable.notifyObservers();
    }

    protected endOnNextFrame(){
        Game.scene.onBeforeRenderObservable.addOnce(() => {
            this._end();
            this._onEndedObservable.notifyObservers();
        });
    }

    protected _onAvailable(): void{
        return;
    }
    protected _onUnavailable(): void{
        return;
    }
    protected abstract _start(): void;
    protected _end(): void{
        return;
    }

}