import {ImportMeshAsync, ImportMeshOptions, Scene} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class Utils {

    public static loadMesh(path: string, scene?: Scene,  options?: ImportMeshOptions | undefined) {
        return ImportMeshAsync(path, scene??Game.scene, options);
    }

}