import {CelestialBody} from "@/YellowSubmarine/sky system/CelestialBody";
import {Color3, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";

export abstract class HemisphericCelestialBody extends CelestialBody{

    private _hemiLight : HemisphericLight

    public get _emissiveColor(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }

    public getPosition(){
        return this._bodyMesh.position;
    }

    public get _direction(): Vector3{
        if(Game.scene.activeCamera){
            this.light.direction = this._bodyMesh.position.subtract(Game.scene.activeCamera.position).normalize();
            this._hemiLight.direction = this._bodyMesh.position.subtract(Game.scene.activeCamera.position).normalize();
        }
        return this.light.direction;
    }

    constructor() {
        super();
        this._hemiLight = this.createHemiLight(Game.scene);
        this.configMaterials(Game.scene);
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