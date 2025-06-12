import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {Observable} from "@babylonjs/core";

export abstract class AbstractDialogueNode<IndexType> {

    private _onStartedObservable = new Observable<void>();
    private _onEndedObservable = new Observable<void>();

    public get onStartedObservable(): Observable<void> {
        return this._onStartedObservable;
    }

    public get onEndedObservable(): Observable<void> {
        return this._onEndedObservable;
    }

    public abstract get bbText(): BBText;

    public Start(){
        this.onStart();
        this._onStartedObservable.notifyObservers();
    }
    protected abstract onStart(): void;

    public End(){
        this.onEnd();
        this._onEndedObservable.notifyObservers();
    }
    protected abstract onEnd(): void

    public abstract get next(): AbstractDialogueNode<any> | undefined

    public abstract getChild(index: IndexType): AbstractDialogueNode<any> | undefined;
    public abstract setChild(node: AbstractDialogueNode<any>, index: IndexType): void;

}
