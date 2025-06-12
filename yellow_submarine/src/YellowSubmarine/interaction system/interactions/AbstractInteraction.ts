import {Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export abstract class AbstractInteraction {

    private _onStartedObservable = new Observable<void>()
    private _onEndedObservable = new Observable<void>();

    public get onStartedObservable(){
        return this._onStartedObservable;
    }

    public get onEndedObservable(){
        return this._onEndedObservable;
    }

    public start(){
        this.onStart();
        this._onStartedObservable.notifyObservers();
    }
    protected abstract onStart(): void;

    protected end(){
        this._onEndedObservable.notifyObservers();
    }

}