import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Color3, Observable, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class DayNightCycle {
    
    private _sun : Sun;
    private _moon : Moon;
    private _time = 0;
    public static onDayChanged = new Observable<boolean>();
    private _isDayTime = true;

    constructor(sky : Sky) {
        this._sun = sky.sun;
        this._moon = sky.moon;

        Game.scene.onBeforeRenderObservable.add(() => {
            this._time += Game.engine.getDeltaTime() * 0.00001;
            if (this._time > 1) this._time -= 1;

            this.updateBody(this._time);
            this.updateLight();
            this.updateMoonLight();
        });
    }

    public get timeOfTheDay(): number{
        return this._time;
    }



    private updateBody(time: number): void {
        const sunAngle = time * 2.0 * Math.PI;
        const moonAngle = (time * 2.0 * Math.PI) / 1.5 + Math.PI;

        const sunRadius = this._sun._defaultPosition.length();
        const moonRadius = this._moon._defaultPosition.length();

        const inclination = Math.PI / 6;

        const sunX = sunRadius * Math.cos(sunAngle);
        const sunY = sunRadius * Math.sin(sunAngle) * Math.sin(inclination);
        const sunZ = sunRadius * Math.sin(sunAngle) * Math.cos(inclination);

        const moonInclination = Math.PI / 8;
        const moonX = moonRadius * Math.cos(moonAngle);
        const moonY = moonRadius * Math.sin(moonAngle) * Math.sin(moonInclination);
        const moonZ = moonRadius * Math.sin(moonAngle) * Math.cos(moonInclination);

        this._sun.position = new Vector3(sunX, sunY, sunZ);
        this._moon.position = new Vector3(moonX, moonY, moonZ);
    }

    private updateLight(){
        const sunPos = this._sun.position;
        const sunRadius = this._sun._defaultPosition.length();
        const sunHeight = sunPos.y;

        const normalized = Math.max(0, Math.min(sunHeight / sunRadius, 1));
        const smooth = Math.pow(normalized, 1.5);

        this._sun.light.intensity = smooth * this._sun._intensity;

        if (normalized <= 0.01) {
            this._sun.light.setEnabled(false);
        } else {
            this._sun.light.setEnabled(true);
        }

        if (smooth > 0 && smooth < 0.3) {
            const sunsetColor = Color3.FromHexString("#ff884d");
            this._sun.light.diffuse = Color3.Lerp(sunsetColor, Color3.White(), smooth / 0.3);
        } else {
            this._sun.light.diffuse = Color3.White();
        }

        const hemi = this._sun.hemiLight;
        if (hemi) {
            const dayColor = Color3.FromHexString("#b6e8ff");
            const nightColor = Color3.FromHexString("#1a1a2e");
            hemi.diffuse = Color3.Lerp(nightColor, dayColor, smooth);
        }

        if(this._isDayTime !== (normalized > 0.01)){
            this._isDayTime = normalized > 0.01;
            DayNightCycle.onDayChanged.notifyObservers(this._isDayTime);
        }

        Game.scene.ambientColor = new Color3(1, 0, 0);
    }

    private updateMoonLight(): void {
        const moonPos = this._moon.position;
        const moonRadius = this._moon._defaultPosition.length();
        const moonHeight = moonPos.y;

        const normalized = Math.max(0, Math.min(moonHeight / moonRadius, 1));
        const smooth = Math.pow(normalized, 1.5);

        if (this._moon.light) {
            this._moon.light.intensity = smooth * this._moon._intensity;

            if (normalized <= 0.01) {
                this._moon.light.setEnabled(false);
            } else {
                this._moon.light.setEnabled(true);
            }
        }

        const hemi = this._moon.hemiLight;
        if (hemi) {
            const nightColor = Color3.FromHexString("#818de3");
            const deepNightColor = Color3.FromHexString("#1a1a2e");
            hemi.diffuse = Color3.Lerp(deepNightColor, nightColor, smooth);
            hemi.intensity = 0.1 + smooth * 0.3;
        }

    }
}