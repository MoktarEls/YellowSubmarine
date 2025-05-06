import {Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class World extends Scene{

    public static get instance(): World {
        return this._instance;
    }

    private static _instance: World;

    private static _sun: Sun;
    private static _sea: Sea;
    private static _submarine: Submarine;

    constructor(
        options?: SceneOptions,
    ) {
        super(Game.engine, options);
        World._instance = this;
    }

    public initialize(): void {
        World._sun = new Sun();
        World._sea = new Sea();
        World._submarine = new Submarine();
    }

}