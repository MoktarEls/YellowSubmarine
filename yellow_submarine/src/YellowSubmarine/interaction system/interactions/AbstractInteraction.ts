import {Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export abstract class AbstractInteraction {

    private _onStarted = new Observable<void>()
    private _onEnded = new Observable<void>();

    public get onStarted(){
        return this._onStarted;
    }

    public get onEnded(){
        return this._onEnded;
    }

    public start(){
        this.onStart();
        this._onStarted.notifyObservers();
    }
    protected abstract onStart(): void;

    protected end(){
        this._onEnded.notifyObservers();
    }

}