import {Mirror} from "@/YellowSubmarine/mirror puzzle/Mirror";
import {TransformNode} from "@babylonjs/core";
import {LightReactor} from "@/YellowSubmarine/mirror puzzle/LightReactor";

export class MirrorPuzzle {

    private _transformNode: TransformNode = new TransformNode("MirrorPuzzleTransformNode");
    private _mirrors: Mirror[] = [];
    private _lightReactor: LightReactor;

    constructor() {
        // TODO : Create the light reactor
        this._lightReactor = new LightReactor();
        // TODO : Create the mirrors
        // TODO : Add the mirrors to the _mirrors array
    }



}