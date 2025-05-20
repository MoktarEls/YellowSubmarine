import {AbstractMesh, Mesh, PBRMaterial, SceneLoader, StandardMaterial, Vector3,} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {NPC} from "@/YellowSubmarine/NPC";
import {World} from "@/YellowSubmarine/World";
import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";

export class Island extends KeyZone{

    private _mesh!: AbstractMesh;
    private _npc: NPC;

    constructor(){

        super("Dolphin island",
            new SphericDetectionZone(40, true));

        this._npc = new NPC();

        this.createMesh().then( () => {
            this._detectionZone.zone.parent = this._mesh;

            World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
                this.detectionZone.addMeshToDetect(mesh);
            })
        });

    }

    public get npc(): NPC {
        return this._npc;
    }

    private async createMesh() {
        const result = await SceneLoader.ImportMeshAsync("", "models/", "dolphinIsland.glb", Game.scene);
        this._mesh = result.meshes[0] as Mesh;
        this._mesh.name = "dolphinIsland";
        this._mesh.position = new Vector3(0,0, -30)
        result.meshes.forEach( (mesh: AbstractMesh) => {
            const mat = mesh.material as PBRMaterial;
            if(mat){
                const toonShader = new CartoonShaderMaterial();
                toonShader.assignMaterial(mesh).then( () => {
                        toonShader.configureFromPBRMaterial(mat);
                    }
                );
            }
        });
    }

}