import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {TransformNode, Vector3} from "@babylonjs/core";
import {Utils} from "@/YellowSubmarine/Utils";
import {NPCFactory} from "@/YellowSubmarine/npcs/NPCFactory";

export class KeyZoneFactory {

    public static createDolphinIsland(): KeyZone {
        const _transformIsland: TransformNode = new TransformNode("island transform");
        const island = new KeyZone();

        island.name = "Dolphin island";
        island.detectionZone = new SphericalDetectionZone({
            diameter : 200
        }, true);

        Utils.loadMesh("models/scenes/dolphinIsland.glb").then((result) => {
            island.mesh = result.meshes[0];
            island.mesh.parent = _transformIsland;
        });

        NPCFactory.createPedro().then( (pedro) => {
            pedro.transformNode.position = new Vector3(-30, 15, -14);
            pedro.transformNode.parent = _transformIsland;
        });

        _transformIsland.position = new Vector3(0, 0, 60);

        return island;
    }

}