import {
    Color3,
    Vector3
} from "@babylonjs/core";
import {HemisphericCelestialBody} from "@/YellowSubmarine/sky system/HemisphericCelestialBody";

export class Moon extends HemisphericCelestialBody {

    // Physics Characteristic
    public override get _defaultPosition(): Vector3{
        return new Vector3(1000, 200, 1000);
    }
    public override get _diameter(): number {
        return 40;
    }

    // Light Characteristic
    public override get _intensity(): number {
        return 2;
    }
    public override get hemiLightIntensity(){
        return 1;
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
        const moonAngle = (time * 2.0 * Math.PI) / 1.5 + Math.PI;
        const moonRadius = this._defaultPosition.length();
        const moonInclination = Math.PI / 8;
        const moonX = moonRadius * Math.cos(moonAngle);
        const moonY = moonRadius * Math.sin(moonAngle) * Math.sin(moonInclination);
        const moonZ = moonRadius * Math.sin(moonAngle) * Math.cos(moonInclination);
        this.position = new Vector3(moonX, moonY, moonZ);
        this.updateLight();
    }

    protected override updateLight(): void {
        const moonPos = this.position;
        const moonRadius = this._defaultPosition.length();
        const moonHeight = moonPos.y;

        const normalized = Math.max(0, Math.min(moonHeight / moonRadius, 1));
        const smooth = Math.pow(normalized, 1.5);

        if (this.light) {
            this.light.intensity = smooth * this._intensity;

            if (normalized <= 0.01) {
                this.light.setEnabled(false);
            } else {
                this.light.setEnabled(true);
            }
        }
        const hemi = this.hemiLight;
        if (hemi) {
            const nightColor = Color3.FromHexString("#818de3");
            const deepNightColor = Color3.FromHexString("#1a1a2e");
            hemi.diffuse = Color3.Lerp(deepNightColor, nightColor, smooth);
            hemi.intensity = 0.1 + smooth * 0.3;
        }
    }
}
