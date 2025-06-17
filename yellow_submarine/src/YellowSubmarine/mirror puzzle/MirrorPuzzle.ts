import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {TransformNode, Vector3} from "@babylonjs/core";
import {LightReactor} from "@/YellowSubmarine/mirror puzzle/LightReactor";

export class MirrorPuzzle {

    private _transformNode: TransformNode = new TransformNode("MirrorPuzzleTransformNode");
    private _mirrors: Mirror[] = [];
    private _lightReactor: LightReactor;

    constructor() {
        // TODO : Create the light reactor
        this._lightReactor = new LightReactor();
        const mirror1 = new Mirror(30);
        mirror1.transformNode.parent = this._transformNode;
        mirror1.transformNode.position = new Vector3(0,2,0);
        // TODO : Create the mirrors
        // TODO : Add the mirrors to the _mirrors array
    }



}