import {Scene} from "@babylonjs/core";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {SkyBox} from "@/YellowSubmarine/sky system/SkyBox";

export class Sky{

    private static _instance: Sky;

    private _sun: Sun;
    private _skybox: SkyBox;

    public static get instance(): Sky{
        return this._instance;
    }

    constructor() {
        Sky._instance = this;
        // TODO : Add moon and daynight cycle
        this._sun = new Sun();
        this._skybox = new SkyBox();
    }
}