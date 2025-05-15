import {Scene} from "@babylonjs/core";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {SkyBox} from "@/YellowSubmarine/sky system/SkyBox";
import {World} from "@/YellowSubmarine/World";
import {DayNightCycle} from "@/YellowSubmarine/sky system/DayNightCycle";

export class Sky{
    private static _instance: Sky;

    private _sun : Sun;
    // private _moon : Moon;
    private _skybox : SkyBox;
    private _dayNightCycle: DayNightCycle;

    public static get instance(): Sky{
        return this._instance;
    }

    constructor() {
        Sky._instance = this;
        this._sun = new Sun();
        //this._moon = new Moon();
        this._skybox = new SkyBox();
        this._dayNightCycle = new DayNightCycle(this);
    }

    public get sun(): Sun {
        return this._sun;
    }

    public set sun(value: Sun) {
        this._sun = value;
    }

    public static get sun(){
        return this._instance._sun;
    }

    public get skybox(): SkyBox {
        return this._skybox;
    }

    public set skybox(value: SkyBox) {
        this._skybox = value;
    }

/*    public get moon(): Moon {
        return this._moon;
    }

    public set moon(value: Moon) {
        this._moon = value;
    }*/

    public get dayNightCycle(): DayNightCycle {
        return this._dayNightCycle;
    }

}