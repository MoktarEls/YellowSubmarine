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

        // TODO : Create the mirrors
        const mirror1 = new Mirror();
        mirror1.transformNode.position = new Vector3(10,2,0);

        const mirror2 = new BrokenMirror();
        mirror2.transformNode.position = new Vector3(-10,2,0);

        const mirror3 = new Mirror();
        mirror3.transformNode.position = new Vector3(-4,2,10);

        const mirror4 = new Mirror();
        mirror4.transformNode.position = new Vector3(4,2,10);

        const mirror5 = new Mirror();
        mirror5.transformNode.position = new Vector3(0,2,-10);

        mirror1.nextLightReceiver = mirror2;
        mirror2.nextLightReceiver = mirror5;
        mirror5.nextLightReceiver = mirror4;
        mirror4.nextLightReceiver = mirror3;
        mirror3.nextLightReceiver = this._lightReactor;
    }



}