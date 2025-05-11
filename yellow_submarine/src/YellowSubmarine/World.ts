import {Camera, Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sky} from "@/YellowSubmarine/sky system/Sky";

export class World {

    public get scene(): Scene {
        return this._scene;
    }

    public get submarine(): Submarine{
        return this._submarine;
    }

    public static get camera(): Camera {
        return this.instance.submarine.submarineCamera.camera;
    }

    public static get sun(): Sun {
        return <Sun>this.instance._sky.sun;
    }

    private static get instance(): World {
        return this._instance;
    }

    private static _instance: World;
    private _scene: Scene;
    _sky : Sky;
    private _sea: Sea;
    private _submarine: Submarine;


    constructor(
        private _game: Game,
        options?: SceneOptions,
    ) {
        this._scene = new Scene(_game.engine, options);
        World._instance = this;
        this._sky = new Sky(this);
        this._submarine = new Submarine(this);
        this._sea = new Sea(this);
    }

    public init(): void {
        this._sky.init();
        this._submarine.init();
        this._sea.init();
    }

}