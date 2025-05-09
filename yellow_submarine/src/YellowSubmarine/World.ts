import {Camera, Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {SkyBox} from "@/YellowSubmarine/SkyBox";
import {TestObject} from "@/YellowSubmarine/TestObject";

export class World {



    public get skybox(): SkyBox {
        return this._skybox;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get sun(): Sun{
        return this._sun;
    }

    public get submarine(): Submarine{
        return this._submarine;
    }

    public static get camera(): Camera {
        return this.instance.submarine.submarineCamera.camera;
    }

    public static get sun(): Sun {
        return <Sun>this.instance.sun;
    }

    public static get skybox(){
        return this.instance.skybox;
    }

    private static get instance(): World {
        return this._instance;
    }

    private static _instance: World;
    private _scene: Scene;

    private _sun: Sun;
    private _sea: Sea;
    private _submarine: Submarine;
    //private _object: TestObject;
    private _skybox: SkyBox;

    constructor(
        private _game: Game,
        options?: SceneOptions,
    ) {
        this._scene = new Scene(_game.engine, options);
        World._instance = this;
        this._sun = new Sun(this);
        this._skybox = new SkyBox(this);
        this._submarine = new Submarine(this);
        this._sea = new Sea(this);
        //this._object = new TestObject(this);
    }

    public init(): void {
        this._sun.init();
        this._skybox.init();
        this._submarine.init();
        this._sea.init();
    }

}