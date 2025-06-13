import {BBText} from "@/YellowSubmarine/BBCode/BBText";
import {BBTextBuilder} from "@/YellowSubmarine/BBCode/builders/BBTextBuilder";
import {Observable} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

export abstract class AbstractDialogueNode<IndexType> {

    private _onStartedObservable = new Observable<void>();
    private _onEndedObservable = new Observable<void>();

    protected _isAutoSkipped = false;
    public get isAutoSkipped() {
        return this._isAutoSkipped;
    }

    public get onStartedObservable(): Observable<void> {
        return this._onStartedObservable;
    }

    public get onEndedObservable(): Observable<void> {
        return this._onEndedObservable;
    }

    public abstract get bbText(): BBText;

    public Start(dialogue: Dialogue){
        this.onStart(dialogue);
        this._onStartedObservable.notifyObservers();
    }
    protected abstract onStart(dialogue: Dialogue): void;

    public End(dialogue: Dialogue){
        this.onEnd(dialogue);
        this._onEndedObservable.notifyObservers();
    }
    protected abstract onEnd(dialogue: Dialogue): void

    public abstract get next(): AbstractDialogueNode<any> | undefined

    public abstract getChild(index: IndexType): AbstractDialogueNode<any> | undefined;
    public abstract setChild(node: AbstractDialogueNode<any>, index: IndexType): void;


}
