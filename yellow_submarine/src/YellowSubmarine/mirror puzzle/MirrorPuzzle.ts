import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {TransformNode, Vector3} from "@babylonjs/core";
import {LightReactor} from "@/YellowSubmarine/mirror puzzle/LightReactor";
import {BrokenMirror} from "@/YellowSubmarine/mirror puzzle/BrokenMirror";

export class MirrorPuzzle {

    private _transformNode: TransformNode = new TransformNode("MirrorPuzzleTransformNode");
    private _lightReactor: LightReactor;

    constructor() {
        // TODO : Create the light reactor
        this._lightReactor = new LightReactor();
        this._lightReactor.onLightReceivedObservable.addOnce(() => {
            console.log("Le phare est réparé !!");
            console.log("Il faut mettre à jour la quête !!");
        })

        // TODO : Create the mirrors
        const mirror1 = new Mirror(5);
        mirror1.transformNode.position = new Vector3(10,2,0);

        const mirror2 = new BrokenMirror();
        mirror2.transformNode.position = new Vector3(-10,2,0);

        const mirror3 = new Mirror(2);
        mirror3.transformNode.position = new Vector3(-4,2,10);

        const mirror4 = new Mirror(4);
        mirror4.transformNode.position = new Vector3(4,2,10);

        const mirror5 = new Mirror(2);
        mirror5.transformNode.position = new Vector3(0,2,-10);

        mirror1.nextLightReceiver = mirror2;
        mirror2.nextLightReceiver = mirror5;
        mirror5.nextLightReceiver = mirror4;
        mirror4.nextLightReceiver = mirror3;
        mirror3.nextLightReceiver = this._lightReactor;

        mirror1.linkedMirror = mirror3;
        mirror3.linkedMirror = mirror4;
        mirror4.linkedMirror = mirror1;
        mirror5.linkedMirror = mirror1;
    }



}