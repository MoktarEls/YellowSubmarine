import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {MeshBuilder, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class KeyZoneFactory {

    public static createDolphinIsland(): KeyZone {
        const island = new KeyZone();

        island.name = "Dolphin island";
        island.detectionZone = new SphericDetectionZone(20, true);

        island.mesh = MeshBuilder.CreateBox("islandBody", {
            height: 20,
            width: 20,
            depth: 30,
        }, Game.scene);

        island.mesh.position = new Vector3(0, 0, 40);

        return island;
    }

}