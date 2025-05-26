import {Color3, TransformNode, Vector3} from "@babylonjs/core";
import {Socle} from "@/YellowSubmarine/temple/Socle";

export class TemplePuzzle {
    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    private _transformNode: TransformNode = new TransformNode("templePuzzle");

    public constructor(parent: TransformNode, position: Vector3) {
        this._transformNode.parent = parent;
        this._transformNode.rotation = Vector3.Zero();
        this._transformNode.position = position;
        this.createSocle(new Vector3(-1,0,-1).scale(20));
        this.createSocle(new Vector3(-1,0,0).scale(20), Color3.Purple());
        this.createSocle(new Vector3(-1,0,1).scale(20), Color3.Blue());
        this.createSocle(new Vector3(0,0,1).scale(20), Color3.Green());
        this.createSocle(new Vector3(1,0,1).scale(20), Color3.Red());
        this.createSocle(new Vector3(1,0,0).scale(20));
        this.createSocle(new Vector3(1,0,-1).scale(20), Color3.Gray());
        this.createSocle(new Vector3(0,0,-1).scale(20), Color3.Yellow());
        this.createSocle(Vector3.Zero());
    }

    private createSocle(position: Vector3, validColor?: Color3){
        const socle = new Socle(this._transformNode, position);
        socle.validColor = validColor;
    }
}