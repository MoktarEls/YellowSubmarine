import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {KeyZoneFactory} from "@/YellowSubmarine/keyzone system/KeyZoneFactory";
import {PhysicsMotionType, Vector3} from "@babylonjs/core";

export class World {
    private _sky: Sky;

    public get submarine(): Submarine{
        return this._submarine;
    }

    public static get submarine(): Submarine {
        return this.instance.submarine;
    }

    private static get instance(): World {
        return this._instance;
    }

    private static _instance: World;

    private _sea: Sea;
    private _submarine: Submarine;

    constructor() {
        World._instance = this;
        this._sea = new Sea();
        this._submarine = new Submarine();
        this._sky = new Sky();
        // KeyZoneFactory.createDolphinIsland();
        KeyZoneFactory.createTemple();
    }

}