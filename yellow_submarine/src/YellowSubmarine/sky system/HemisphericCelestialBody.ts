import {CelestialBody} from "@/YellowSubmarine/sky system/CelestialBody";
import {Color3, HemisphericLight, Scene, ShadowGenerator, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export abstract class HemisphericCelestialBody extends CelestialBody{

    private _hemiLight : HemisphericLight
    private shadowGenerator: ShadowGenerator;

    public get hemiLight(){
        return this._hemiLight;
    }

    public get hemiLightIntensity(){
        return this._hemiLight.intensity;
    }

    public get _emissiveColor(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }

    public getPosition(){
        return this._bodyMesh.position;
    }

    public get _direction(): Vector3{
        if(Game.scene.activeCamera){
            this.light.direction = this._bodyMesh.absolutePosition.subtract(Vector3.Zero()).normalize();
            this._hemiLight.direction = this._bodyMesh.position.subtract(Game.scene.activeCamera.position).normalize();
        }
        return this.light.direction;
    }

    constructor() {
        super();
        this._hemiLight = this.createHemiLight(Game.scene);
        this.configMaterials(Game.scene);
        this._hemiLight.direction = Vector3.Up();
        this._hemiLight.isEnabled(false);
        this.shadowGenerator = new ShadowGenerator(1024, this.light);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
        this.shadowGenerator.blurKernel = 16;
        this.light.shadowEnabled = true;
        Game.scene.onBeforeRenderObservable.add(() => {
            if (Game.scene.activeCamera) {
                const dir = this._bodyMesh.absolutePosition.subtract(Vector3.Zero()).normalize();
                this.light.direction = dir.negate();
            }
        });
    }

    private createHemiLight(scene: Scene) : HemisphericLight{
        const light = new HemisphericLight("hemisphericLight", Vector3.Up(), scene);
        light.intensity = 2;
        light.diffuse = this._diffuse;
        light.shadowEnabled = false;
        light.parent = this._bodyMesh;
        return light;
    }

}