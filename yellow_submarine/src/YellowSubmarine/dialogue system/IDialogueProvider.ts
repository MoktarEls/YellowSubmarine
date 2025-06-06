import {AbstractMesh} from "@babylonjs/core";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";

export interface IDialogueProvider {

    get name(): string;
    get mesh(): AbstractMesh | undefined;
    get dialogue(): Dialogue | undefined;
    get cameraConfiguration(): CameraConfiguration | undefined;

}