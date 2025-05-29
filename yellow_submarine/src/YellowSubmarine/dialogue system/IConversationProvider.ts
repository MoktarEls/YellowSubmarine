import {AbstractMesh} from "@babylonjs/core";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";

export interface IConversationProvider {

    get name(): string;
    get mesh(): AbstractMesh | undefined;
    get conversation(): Conversation | undefined;
    get cameraConfiguration(): CameraConfiguration | undefined;

}