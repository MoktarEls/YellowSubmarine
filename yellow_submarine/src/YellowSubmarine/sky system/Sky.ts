import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {SkyBox} from "@/YellowSubmarine/sky system/SkyBox";
import {World} from "@/YellowSubmarine/World";
import {DayNightCycle} from "@/YellowSubmarine/sky system/DayNightCycle";

export class Sky{

    private _sun : Sun;
    private _moon : Moon;
    private _skybox : SkyBox;

    constructor(public _world : World) {
        this._sun = new Sun(_world);
        this._moon = new Moon(_world);
        this._skybox = new SkyBox(_world);
    }

    public init(): void {
        this._sun.init();
        this._moon.init();
        this._skybox.init();
        new DayNightCycle(this);
    }

    public get sun(): Sun {
        return this._sun;
    }

    public set sun(value: Sun) {
        this._sun = value;
    }

    public get skybox(): SkyBox {
        return this._skybox;
    }

    public set skybox(value: SkyBox) {
        this._skybox = value;
    }

    public get moon(): Moon {
        return this._moon;
    }

    public set moon(value: Moon) {
        this._moon = value;
    }

}