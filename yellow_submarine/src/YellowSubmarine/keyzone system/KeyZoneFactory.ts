import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {Vector3} from "@babylonjs/core";
import {Utils} from "@/YellowSubmarine/Utils";
import {NPCFactory} from "@/YellowSubmarine/npcs/NPCFactory";

export class KeyZoneFactory {

    public static createDolphinIsland(): KeyZone {
        const island = new KeyZone();

        island.name = "Dolphin island";
        island.detectionZone = new SphericDetectionZone(20, true);

        Utils.loadMesh("models/scenes/dolphinIsland.glb").then((result) => {
            island.mesh = result.meshes[0];
            console.log(island.mesh.position);
            console.log(island.mesh.rotation);
            island.mesh.position = new Vector3(0, 0, 40);
        });

        NPCFactory.createPedro().then( (pedro) => {
            pedro.transformNode.position = new Vector3(15.70, 17.1, 37);
            console.log(pedro.transformNode.position);
        });

        return island;
    }

}