import {Camera, Scene, SceneOptions} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {SkyBox} from "@/YellowSubmarine/sky system/SkyBox";
import {Sky} from "@/YellowSubmarine/sky system/Sky";

export class World {
    private _sky: Sky;

    public get submarine(): Submarine{
        return this._submarine;
    }

    public static get camera(): Camera {
        return this.instance.submarine.submarineCamera.camera;
    }

    private static get instance(): World {
        return this._instance;
    }

    private static _instance: World;

    private _sea: Sea;
    private _submarine: Submarine;

    constructor(
        private _scene: Scene,
    ) {
        World._instance = this;
        this._sky = new Sky(this._scene);
        // this._skybox = new SkyBox(this);
        this._sea = new Sea(this);
        this._submarine = new Submarine(this);
    }

    public init(): void {
        this._submarine.init();
        this._sea.init();
    }

}