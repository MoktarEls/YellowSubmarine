import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class DayNightCycle {
    
    private _sun : Sun;
    //private _moon : Moon;
    
    constructor(sky : Sky) {
        this._sun = sky.sun;
        //this._moon = sky.moon;

        let time = 0;

        sky._world.scene.onBeforeRenderObservable.add(() => {
            time += Game.engine.getDeltaTime() * 0.0001;
            if (time > 1) time = 0;

            this.updateSun(time);
        });
    }

    public updateSun(time: number): void {

        const angle = time * 2.0 * Math.PI;
        const radius = this._sun._defaultPosition.x;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle)
        const z = 0;

        this._sun.position = new Vector3(x, y, z);
        this._sun._direction;
    }
}