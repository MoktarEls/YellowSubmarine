    import {Color3, Mesh, MeshBuilder, Texture, Vector2, Vector3} from "@babylonjs/core";
    import {WaterMaterial} from "@babylonjs/materials";
    //import {SeaShaderMaterial} from "@/YellowSubmarine/shader material/SeaShaderMaterial";
    import {World} from "@/YellowSubmarine/World";
    import {SeaShaderMaterial} from "@/YellowSubmarine/shader material/SeaShaderMaterial";

    export class Sea {

        private static _instance: Sea;
        private _groundMesh: Mesh;

        constructor(private _world: World) {
            this._groundMesh = new Mesh("");
        }

        public init(): void {
            this._groundMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 512,
                    height: 512,
                    subdivisions: 64,
                },
                this._world.scene
            );

            /*const waterMaterial = new WaterMaterial("seaMaterial", this._world.scene, new Vector2(512,512));
            waterMaterial.bumpTexture = new Texture("/textures/noiseTexture.png", this._world.scene);

            waterMaterial.windForce = -15;
            waterMaterial.waveHeight = 0;
            waterMaterial.windDirection = new Vector2(1, 1);
            waterMaterial.waterColor = new Color3(0.1, 0.1, 0.6);
            waterMaterial.colorBlendFactor = 0.3;
            waterMaterial.bumpHeight = 0.01;
            waterMaterial.waveLength = 0.1;
            waterMaterial.alpha = 0.3;

            waterMaterial.addToRenderList(this._world.sun.sunMesh);
            waterMaterial.addToRenderList(this._world.sun.haloMesh);
            waterMaterial.addToRenderList(this._world.skybox.mesh);
            waterMaterial.addToRenderList(this._world.submarine.mesh);*/

            const waterMaterial = SeaShaderMaterial.material;

            this._groundMesh.material = waterMaterial;
        }

    }