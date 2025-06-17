import {IReceiveLight} from "@/YellowSubmarine/mirror puzzle/IReceiveLight";
import {Observable, TransformNode} from "@babylonjs/core";

export class LightReactor implements IReceiveLight{
    private _transformNode: TransformNode;

    private _onLightReceivedObservable: Observable<void>;
    public get onLightReceivedObservable(){
        return this._onLightReceivedObservable;
    }

    constructor(){
        this._transformNode = new TransformNode("lightReactorTransformNode")
        this._onLightReceivedObservable = new Observable();
    }

    lightReceiverTransformNode(): TransformNode {
        return this._transformNode;
    }

    receiveLight(): void {
        this._onLightReceivedObservable.notifyObservers();
    }

    stopReceivingLight(): void {
        return;
    }



}