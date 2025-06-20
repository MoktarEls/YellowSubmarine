import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {Observable, TransformNode, Vector3} from "@babylonjs/core";
import {LightReactor} from "@/YellowSubmarine/mirror puzzle/LightReactor";
import {BrokenMirror} from "@/YellowSubmarine/mirror puzzle/BrokenMirror";

export class MirrorPuzzle {

    private static _instance: MirrorPuzzle;
    public static get instance(){
        return this._instance;
    }

    private _onPuzzleSolvedObservable: Observable<void>;
    public get onPuzzleSolvedObservable() {
        return this._onPuzzleSolvedObservable;
    }
    private _transformNode: TransformNode = new TransformNode("MirrorPuzzleTransformNode");
    public get transformNode() {
        return this._transformNode;
    }

    private _lightReactor: LightReactor;

    constructor() {
        MirrorPuzzle._instance = this;
        const mirror1 = new Mirror(5);
        mirror1.transformNode.position = new Vector3(50,2,0);
        mirror1.transformNode.parent = this._transformNode;

        const mirror2 = new BrokenMirror();
        mirror2.transformNode.position = new Vector3(-50,2,0);
        mirror2.transformNode.parent = this._transformNode;

        const mirror3 = new Mirror(2);
        mirror3.transformNode.position = new Vector3(-20,2,50);
        mirror3.transformNode.parent = this._transformNode;

        const mirror4 = new Mirror(4);
        mirror4.transformNode.position = new Vector3(20,2,50);
        mirror4.transformNode.parent = this._transformNode;

        const mirror5 = new Mirror(2);
        mirror5.transformNode.position = new Vector3(0,2,-50);
        mirror5.transformNode.parent = this._transformNode;

        this._lightReactor = new LightReactor();
        this._lightReactor.transformNode.parent = this._transformNode;
        this._onPuzzleSolvedObservable = new Observable<void>();
        this._lightReactor.onLightReceivedObservable.add(() => {
            this._onPuzzleSolvedObservable.notifyObservers();
        })

        mirror1.nextLightReceiver = mirror2;
        mirror2.nextLightReceiver = mirror5;
        mirror5.nextLightReceiver = mirror4;
        mirror4.nextLightReceiver = mirror3;
        mirror3.nextLightReceiver = this._lightReactor;

        mirror1.linkedMirror = mirror3;
        mirror4.linkedMirror = mirror5;
        mirror5.linkedMirror = mirror1;
    }



}