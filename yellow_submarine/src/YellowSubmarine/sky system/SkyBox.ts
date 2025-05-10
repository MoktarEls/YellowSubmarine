import {World} from "@/YellowSubmarine/World";
import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial, StandardMaterial, Vector3,
} from "@babylonjs/core";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Game} from "@/YellowSubmarine/Game";

export class SkyBox {

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _mesh: Mesh;

    constructor(private _world: World) {
        this._mesh = new Mesh("");

    }

    public init(){
        this._mesh = MeshBuilder.CreateBox("skyBox", { size: 10000 }, this._world.scene);
        this._mesh.infiniteDistance = true;

        const _mat = new StandardMaterial("skyMat", this._world.scene);
        _mat.backFaceCulling = false;
        _mat.disableLighting = true;
        _mat.specularColor = Color3.Black();
        this._mesh.material = _mat;

        this._world.scene.onBeforeRenderObservable.add(() => {
            const up       = new Vector3(0, 1, 0);
            const sunDir           = this._world._sky.sun._direction;
            const t        = Math.min(Math.max(Vector3.Dot(up, sunDir), 0), 1);

            const nightCol = new Color3(0.02, 0.02, 0.1);
            const dayCol   = new Color3(0.5, 0.7, 1.0);

            _mat.diffuseColor = Color3.Lerp(nightCol, dayCol, t);
            _mat.emissiveColor = _mat.diffuseColor;

        });
    }



}