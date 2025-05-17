import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {LoadAssetContainerAsync, Mesh, MeshBuilder, Vector3} from "@babylonjs/core";
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

        this.loadMesh();
        return island;
    }

    private static loadMesh(): void {
        LoadAssetContainerAsync("models/dolphinIsland.glb", Game.scene)
            .then( (container) => {

            const island = container.transformNodes[0];
            const pedro = container.transformNodes[1];

            const pedroPosition = pedro.position;
            pedro.position = Vector3.Zero();

            island.parent = null;
            pedro.parent = null;

            const islandMeshArray = island.getChildMeshes<Mesh>();
            const islandMesh = Mesh.MergeMeshes(islandMeshArray, true, undefined, undefined, undefined, true);

            const pedroMeshArray = pedro.getChildMeshes<Mesh>();
            const pedroMesh = Mesh.MergeMeshes(pedroMeshArray, true, undefined, undefined, undefined, true);

            if(islandMesh){
                console.log(islandMesh.position);
            }

            if(pedroMesh){
                pedroMesh.position = pedroPosition;
                const detectionZone = new SphericDetectionZone(10, true);
                detectionZone.zone.parent = pedroMesh;

                console.log("trasnform Node", pedro.position);
                console.log("absolute", pedroMesh.absolutePosition);
                console.log("relative", pedroMesh.position);
            }


        });
    }

}