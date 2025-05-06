import {Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class World extends Scene{
    public static get sun(): Sun {
        return World._instance._sun;
    }

    public static get instance(): World {
        return this._instance;
    }

    private static _instance: World;

    private _sun: Sun;
    private _sea: Sea;
    private _submarine: Submarine;

    constructor(
        options?: SceneOptions,
    ) {
        super(Game.engine, options);
        World._instance = this;
        this._sun = new Sun();
        this._sea = new Sea();
        this._submarine = new Submarine();
    }

}