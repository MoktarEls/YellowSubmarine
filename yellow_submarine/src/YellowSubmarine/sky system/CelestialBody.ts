import {
    Color3,
    DirectionalLight,
    GlowLayer,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";

export abstract class CelestialBody {

    protected _bodyMesh : Mesh
    protected _haloMesh : Mesh
    private _light : DirectionalLight

    // Physics Characteristic
    public get _defaultPosition(): Vector3{
        return new Vector3(1000, 200, -1000);
    }

    public get _diameter(): number {
        return 40;
    }

    // Light Characteristic
    public get _intensity(): number {
        return 1.0;
    }
    public get _diffuse(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }
    public get _specular(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }
    public get _emissiveColor(): Color3 {
        return new Color3(1.0, 1.0, 1.0);
    }

    constructor(){
        this._bodyMesh = this.createBody(Game.scene);
        this._haloMesh = this.createHalo(Game.scene);
        this._light = this.createLight(Game.scene);
        this.configMaterials(Game.scene);
    }

    private createBody(scene: Scene) : Mesh{
        const body = MeshBuilder.CreateSphere("celestialBody", {
            diameter: this._diameter,
            segments: 32
        }, scene);
        body.infiniteDistance = true;
        body.isPickable = false;
        body.position = this._defaultPosition;
        return body;
    }

    private createHalo(scene: Scene) : Mesh{
        const halo = MeshBuilder.CreateSphere("halo", {
            diameter: this._diameter * 1.05,
            segments: 32
        }, scene);
        halo.infiniteDistance = true;
        halo.isPickable = false;
        halo.position = this._defaultPosition;
        return halo;
    }

    private createLight(scene: Scene) : DirectionalLight{
        let direction = new Vector3(0, 0, 0);
        if (scene.activeCamera) {
            direction = this._bodyMesh.position.subtract(scene.activeCamera.position).normalize();
        }
        const light = new DirectionalLight("sunLight", direction.negate(), scene);
        light.intensity = this._intensity;
        light.shadowEnabled = true;
        light.parent = this._bodyMesh;
        light.diffuse = this._diffuse;
        light.specular = this._specular;
        const glowLayer = new GlowLayer("", scene);
        glowLayer.intensity = 0.3;
        return light;
    }

    protected configMaterials(scene: Scene){
        const bodyMaterial = new StandardMaterial("bodyMat", scene);
        bodyMaterial.emissiveColor = this._emissiveColor;
        bodyMaterial.diffuseColor = this._diffuse;
        bodyMaterial.specularColor = this._specular;
        this._bodyMesh.material = bodyMaterial;

        const haloMaterial = new StandardMaterial("haloMat", scene);
        haloMaterial.emissiveColor = this._emissiveColor;
        haloMaterial.diffuseColor = this._diffuse;
        haloMaterial.specularColor = this._specular;
        haloMaterial.alpha = 0.5;
        this._haloMesh.material = haloMaterial;
    }

    public get bodyMesh(): Mesh {
        return this._bodyMesh;
    }

    public get haloMesh(): Mesh {
        return this._haloMesh;
    }

    public get light(): DirectionalLight {
        return this._light;
    }

    public get position(): Vector3 {
        return this.bodyMesh.position;
    }

    public set position(position: Vector3){
        this._bodyMesh.position = position;
        this._haloMesh.position = position;
        this.light.position = position;
    }
}