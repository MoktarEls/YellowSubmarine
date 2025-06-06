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
}
