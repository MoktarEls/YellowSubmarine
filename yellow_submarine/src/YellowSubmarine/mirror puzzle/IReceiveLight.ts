import {TransformNode} from "@babylonjs/core";

export interface IReceiveLight{

    receiveLight(): void;
    stopReceivingLight(): void;
    lightReceiverTransformNode(): TransformNode;

}