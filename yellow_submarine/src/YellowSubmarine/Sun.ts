import {
    Color3,
    DirectionalLight,
    HemisphericLight,
    Mesh,
    MeshBuilder, Scene,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class Sun{
    get haloMesh(): Mesh {
        return this._haloMesh;
    }
    get sunMesh(): Mesh {
        return this._sunMesh;
    }

    private static _instance: Sun;

    private _sunMesh : Mesh
    private _haloMesh : Mesh
    private _light : DirectionalLight
    private _hemiLight : HemisphericLight

    constructor(private _world: World) {
        Sun._instance = this;
        this._sunMesh = new Mesh("");
        this._haloMesh = new Mesh("");
        this._light = new DirectionalLight("", Vector3.Down());
        this._hemiLight = new HemisphericLight("", Vector3.Down());
    }

    public init(){
        this._sunMesh = this.createSun(this._world.scene);
        this._haloMesh = this.createHalo(this._world.scene);
        this._light = this.createLight(this._world.scene);
        this._hemiLight = this.createHemiLight(this._world.scene);
        this.configMaterials(this._world.scene);
    }

    private createSun(scene: Scene): Mesh {
        const sun = MeshBuilder.CreateSphere("sun", {
            diameter: 40,
            segments: 32
        }, scene);
        sun.infiniteDistance = true;
        sun.isPickable = false;
        sun.position = new Vector3(1000, 200, -1000);
        return sun;
    }

    private createHalo(scene: Scene): Mesh{
        const halo = MeshBuilder.CreateSphere("sunHalo", {
            diameter: 44,
            segments: 32
        }, scene);
        halo.infiniteDistance = true;
        halo.isPickable = false;
        halo.position = this._sunMesh.position;
        return halo;
    }

    private createLight(scene: Scene):DirectionalLight{
        let direction = new Vector3(0, 0, 0);
        if (scene.activeCamera) {
            direction = this._sunMesh.position.subtract(scene.activeCamera.position).normalize();
        }
        const light = new DirectionalLight("sunLight", direction.negate(), scene);
        light.intensity = 1;
        light.shadowEnabled = true;
        light.position = this._sunMesh.position;
        light.diffuse = new Color3(1.0, 1.0, 1.0);
        light.specular = new Color3(1.0, 1.0, 1.0);
        return light;
    }

    private createHemiLight(scene: Scene) : HemisphericLight{
        let direction = new Vector3(0, 0, 0);
        if (scene.activeCamera) {
            direction = this._sunMesh.position.subtract(scene.activeCamera.position).normalize();
        }
        const light = new HemisphericLight("sunLight", direction, scene);
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
        return this._sunMesh.position;
    }

    private configMaterials(scene: Scene){
        const sunMaterial = new StandardMaterial("sunMat", scene);
        sunMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        sunMaterial.diffuseColor = Color3.Black();
        sunMaterial.specularColor = Color3.Black();
        this._sunMesh.material = sunMaterial;

        const haloMaterial = new StandardMaterial("haloMat", scene);
        haloMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        haloMaterial.diffuseColor = Color3.Black();
        haloMaterial.specularColor = Color3.Black();
        haloMaterial.alpha = 0.5;
        this._haloMesh.material = haloMaterial;
    }
}