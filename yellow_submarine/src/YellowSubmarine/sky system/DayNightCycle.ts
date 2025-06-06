import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Color3, Observable, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class DayNightCycle {
    
    private _sun : Sun;
    private _moon : Moon;
    private _time = 0;
    public static onDayChanged = new Observable<number>();
    public static _sunPhase : number;

    constructor(sky : Sky) {
        this._sun = sky.sun;
        this._moon = sky.moon;

        Game.scene.onBeforeRenderObservable.add(() => {
            this._time += Game.engine.getDeltaTime() * 0.00001;
            if (this._time > 1) this._time -= 1;
            this._sun.update(this._time);
            this._moon.update(this._time);
        });
    }

    public static isDay(): boolean {
        return DayNightCycle._sunPhase > 0;
    }

    public get timeOfTheDay(): number{
        return this._time;
    }
}