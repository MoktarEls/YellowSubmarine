import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class DayNightCycle {
    
    private _sun : Sun;
    // private _moon : Moon;
    private _time = 0;

    constructor(sky : Sky) {
        this._sun = sky.sun;
        // this._moon = sky.moon;

        Game.scene.onBeforeRenderObservable.add(() => {
            this._time += Game.engine.getDeltaTime() * 0.00001;
            if (this._time > 1) this._time -= 1;

            this.updateBody(this._time);
        });
    }

    public get timeOfTheDay(): number{
        return this._time;
    }


    private updateBody(time: number): void {
        const sunAngle = time * 2.0 * Math.PI;
        const moonAngle = (time * 2.0 * Math.PI) / 1.5 + Math.PI;

        const sunRadius = this._sun._defaultPosition.length();
        // const moonRadius = this._moon._defaultPosition.length();

        const inclination = Math.PI / 6;

        const sunX = sunRadius * Math.cos(sunAngle);
        const sunY = sunRadius * Math.sin(sunAngle) * Math.sin(inclination);
        const sunZ = sunRadius * Math.sin(sunAngle) * Math.cos(inclination);

/*
        const moonInclination = Math.PI / 8;
        const moonX = moonRadius * Math.cos(moonAngle);
        const moonY = moonRadius * Math.sin(moonAngle) * Math.sin(moonInclination);
        const moonZ = moonRadius * Math.sin(moonAngle) * Math.cos(moonInclination);
*/

        this._sun.position = new Vector3(sunX, sunY, sunZ);
        // this._moon.position = new Vector3(moonX, moonY, moonZ);
    }
}