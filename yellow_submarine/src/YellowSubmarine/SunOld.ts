import {
    Color3,
    DirectionalLight,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

import {GameOld} from "@/YellowSubmarine/GameOld";

export class SunOld {

    private _sun : Mesh;
    private _halo : Mesh;
    private _light : DirectionalLight
    private _hemiLight : HemisphericLight

    constructor() {
        this._sun = this.createSun();
        this._halo = this.createHalo();
        this._light = this.createLight();
        this._hemiLight = this.createHemiLight();
        this.configMaterials();
    }

    private createSun(): Mesh {
        const sun = MeshBuilder.CreateSphere("sun", {
            diameter: 40,
            segments: 32
        }, GameOld.worldScene);
        sun.infiniteDistance = true;
        sun.isPickable = false;
        sun.position = new Vector3(1000, 200, -1000);
        return sun;
    }

    private createHalo(): Mesh{
        const halo = MeshBuilder.CreateSphere("sunHalo", {
            diameter: 44,
            segments: 32
        }, GameOld.worldScene);
        halo.infiniteDistance = true;
        halo.isPickable = false;
        halo.position = this._sun.position;
        return halo;
    }

    private createLight():DirectionalLight{
        let direction = new Vector3(0, 0, 0);
        if (GameOld.worldScene.activeCamera) {
            direction = this._sun.position.subtract(GameOld.worldScene.activeCamera.position).normalize();
        }
        const light = new DirectionalLight("sunLight", direction.negate(), GameOld.worldScene);
        light.intensity = 1;
        light.shadowEnabled = true;
        light.position = this._sun.position;
        light.diffuse = new Color3(1.0, 1.0, 1.0);
        light.specular = new Color3(1.0, 1.0, 1.0);
        return light;
    }

    private createHemiLight() : HemisphericLight{
        let direction = new Vector3(0, 0, 0);
        if (GameOld.worldScene.activeCamera) {
            direction = this._sun.position.subtract(GameOld.worldScene.activeCamera.position).normalize();
        }
        const light = new HemisphericLight("sunLight", direction, GameOld.worldScene);
        light.intensity = 0.8;
        light.diffuse = new Color3(1.0, 1.0, 1.0);
        light.shadowEnabled = false;

        return light;
    }

    public getLightDirection(): Vector3 {
        return this._light.direction.normalize();
    }

    public getLightColor(): Vector3 {
        const color = this._light.diffuse;
        return new Vector3(color.r, color.g, color.b);
    }

    public getAmbientColor(): Vector3 {
        const color = this._hemiLight.diffuse;
        return new Vector3(color.r, color.g, color.b).scale(this._hemiLight.intensity);
    }

    public getPosition(): Vector3 {
        return this._sun.position;
    }

    private configMaterials(){
        const sunMaterial = new StandardMaterial("sunMat", GameOld.worldScene);
        sunMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        sunMaterial.diffuseColor = Color3.Black();
        sunMaterial.specularColor = Color3.Black();
        this._sun.material = sunMaterial;

        const haloMaterial = new StandardMaterial("haloMat", GameOld.worldScene);
        haloMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        haloMaterial.diffuseColor = Color3.Black();
        haloMaterial.specularColor = Color3.Black();
        haloMaterial.alpha = 0.5;
        this._halo.material = haloMaterial;
    }
}