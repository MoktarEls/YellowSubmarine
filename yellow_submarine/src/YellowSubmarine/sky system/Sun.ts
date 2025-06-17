import {
    Color3,
    Vector3
} from "@babylonjs/core";
import {HemisphericCelestialBody} from "@/YellowSubmarine/sky system/HemisphericCelestialBody";
import {Game} from "@/YellowSubmarine/Game";
import {DayNightCycle} from "@/YellowSubmarine/sky system/DayNightCycle";

export class Sun extends HemisphericCelestialBody {

    // Physics Characteristic
    public override get _defaultPosition(): Vector3{
        return new Vector3(1000, 200, -1000);
    }
    public override get _diameter(): number {
        return 40;
    }

    // Light Characteristic
    public override get _intensity(): number {
        return 5;
    }
    public override get hemiLightIntensity(){
        return 2;
    }
    public override get _diffuse(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }
    public override get _specular(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }
    public override get _emissiveColor(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }

    constructor() {
        super();
    }

    public override update(time: number){
        const sunAngle = time * 2.0 * Math.PI;
        const sunRadius = this._defaultPosition.length();
        const inclination = Math.PI / 6;

        const sunX = sunRadius * Math.cos(sunAngle);
        const sunY = sunRadius * Math.sin(sunAngle) * Math.sin(inclination);
        const sunZ = sunRadius * Math.sin(sunAngle) * Math.cos(inclination);
        this.position = new Vector3(sunX, sunY, sunZ);
        this.updateLight();
    }

    protected override updateLight(){
        const sunPos = this.position;
        const sunRadius = this._defaultPosition.length();
        const sunHeight = sunPos.y;

        const normalized = Math.max(0, Math.min(sunHeight / sunRadius, 1));
        const smooth = Math.pow(normalized, 1.5);

        this.light.intensity = smooth * this._intensity;

        if (normalized <= 0.01) {
            this.light.setEnabled(false);
        } else {
            this.light.setEnabled(true);
        }

        if (smooth > 0 && smooth < 0.3) {
            const sunsetColor = Color3.FromHexString("#ff884d");
            this.light.diffuse = Color3.Lerp(sunsetColor, Color3.White(), smooth / 0.3);
        } else {
            this.light.diffuse = Color3.White();
        }

        const hemi = this.hemiLight;
        if (hemi) {
            const dayColor = Color3.FromHexString("#a6fff5");
            const nightColor = Color3.FromHexString("#27274f");
            hemi.diffuse = Color3.Lerp(nightColor, dayColor, smooth);
        }

        if(DayNightCycle._isDayTime !== (normalized > 0.01)){
            DayNightCycle._isDayTime = normalized > 0.01;
            DayNightCycle.onDayChanged.notifyObservers(DayNightCycle._isDayTime);
        }
        Game.scene.ambientColor = new Color3(1, 0, 0);
    }
}