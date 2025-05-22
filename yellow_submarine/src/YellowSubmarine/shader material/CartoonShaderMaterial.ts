import {
    AbstractMesh,
    Color3,
    InputBlock,
    NodeMaterial,
    Nullable,
    PBRMaterial,
    Texture,
    TextureBlock,
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class CartoonShaderMaterial {

    private _nodeMaterialPromise;
    private _nodeMaterial!: NodeMaterial;

    public async assignMaterial(mesh: AbstractMesh){
        this._nodeMaterialPromise.then(() => {
            mesh.material = this._nodeMaterial;
        })

    }

    public constructor() {
        this._nodeMaterialPromise = NodeMaterial.ParseFromFileAsync("ToonShader", "shaders/ToonPBRMaterialRedshift.json", Game.scene).then((nodeMaterial) => {
            this._nodeMaterial = nodeMaterial;
            this._nodeMaterial.build();
        })
    }

    public set albedoColor(albedoColor: Color3){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("AlbedoColor") as InputBlock).value = albedoColor;
        })
    }

    public set albedoTexture(albedoTexture: Texture){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("AlbedoTexture") as TextureBlock).texture = albedoTexture;
        })
    }

    public set opacity(opacity: number){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("OpacityFactor") as InputBlock).value = opacity;
        })
    }

    public set metallic(metallic: number){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("MetallicFactor") as InputBlock).value = metallic;
        })
    }

    public set metallicTexture(metallicTexture: Texture){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("MetallicTexture") as TextureBlock).texture = metallicTexture;
        })
    }

    public set roughness(roughness: number){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("RoughnessFactor") as InputBlock).value = roughness;
        })
    }

    public set roughnessTexture(roughnessTexture: Texture){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("RoughnessTexture") as TextureBlock).texture = roughnessTexture;
        })
    }

    public set emission(emission: number){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("EmissiveFactor") as InputBlock).value = emission;
        })
    }

    public set emissionColor(emissionColor: Color3){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("EmissiveColor") as InputBlock).value = emissionColor;
        })
    }

    public set emissionTexture(emissionTexture: Texture){
        this._nodeMaterialPromise.then(() => {
            (this._nodeMaterial.getBlockByName("EmissiveTexture") as TextureBlock).texture = emissionTexture;
        })
    }

    public set transparencyMode(transparencyMode: Nullable<number>){
        this._nodeMaterialPromise.then(() => {
            this._nodeMaterial.transparencyMode = transparencyMode;
        })
    }

    public configureFromPBRMaterial(pbrMaterial: PBRMaterial){
        this.albedoColor = pbrMaterial.albedoColor;
        const albedoTexture = pbrMaterial.albedoTexture;
        if(albedoTexture !== null){
            this.albedoTexture = albedoTexture as Texture;
        }

        this.emission = pbrMaterial.emissiveIntensity;
        const emissionTexture = pbrMaterial.emissiveTexture;
        if(emissionTexture !== null){
            this.emissionTexture = emissionTexture as Texture;
        }
        this.emissionColor = pbrMaterial.emissiveColor;

        const metallic = pbrMaterial.metallic;
        if(metallic !== null){
            this.metallic = metallic;
        }
        const metallicTexture = pbrMaterial.metallicTexture;
        if(metallicTexture !== null){
            this.metallicTexture = metallicTexture as Texture;
        }

        const roughness = pbrMaterial.roughness;
        if(roughness !== null){
            this.roughness = roughness;
        }

        this.transparencyMode = pbrMaterial.transparencyMode;
        this._nodeMaterialPromise.then(() => {
            this._nodeMaterial.backFaceCulling = pbrMaterial.backFaceCulling;
            this._nodeMaterial.needDepthPrePass = pbrMaterial.needDepthPrePass;
            this._nodeMaterial.cullBackFaces = pbrMaterial.cullBackFaces;
            this._nodeMaterial.alpha = pbrMaterial.alpha;
            this._nodeMaterial.alphaMode = pbrMaterial.alphaMode;
            this._nodeMaterial.disableDepthWrite = pbrMaterial.disableDepthWrite;
            this._nodeMaterial.disableColorWrite = pbrMaterial.disableColorWrite;
            this._nodeMaterial.forceDepthWrite = pbrMaterial.forceDepthWrite;
            this._nodeMaterial.depthFunction = pbrMaterial.depthFunction;
        })


    }

}