import {CelestialBody} from "@/YellowSubmarine/sky system/CelestialBody";
import {Color3, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export abstract class HemisphericCelestialBody extends CelestialBody{

    private _hemiLight : HemisphericLight

    public get _emissiveColor(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }

    constructor(_world: World) {
        super(_world);
        this._hemiLight = new HemisphericLight("", Vector3.Down());
    }

    public init(){
        super.init();
        this._hemiLight = this.createHemiLight(this._world.scene);
        this.configMaterials(this._world.scene);
    }

    private createHemiLight(scene: Scene) : HemisphericLight{
        let direction = new Vector3(0, 0, 0);
        if (scene.activeCamera) {
            direction = this._defaultPosition.subtract(scene.activeCamera.position).normalize();
        }
        const light = new HemisphericLight("sunLight", direction, scene);
        light.intensity = 0.8;
        light.diffuse = this._diffuse;
        light.shadowEnabled = false;

        return light;
    }
}