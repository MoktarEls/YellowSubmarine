import {Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class World {
    public get scene(): Scene {
        return this._scene;
    }

    public static get scene(): Scene {
        return this.instance.scene;
    }

    public static get sun(): Sun {
        return <Sun>this.instance._sun;
    }

    private static get instance(): World {
        return this._instance;
    }

    private static _instance: World;
    private _scene: Scene;

    private _sun: Sun;
    private _sea: Sea;
    private _submarine: Submarine;

    constructor(
        private _game: Game,
        options?: SceneOptions,
    ) {
        this._scene = new Scene(_game.engine, options);
        World._instance = this;
        this._sun = new Sun(this);
        this._sea = new Sea(this);
        this._submarine = new Submarine(this);
    }

    public init(): void {
        this._sun.init();
        this._sea.init();
        this._submarine.init();
    }

}