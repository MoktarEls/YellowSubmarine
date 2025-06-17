import {IReceiveLight} from "@/YellowSubmarine/mirror puzzle/IReceiveLight";
import {TransformNode} from "@babylonjs/core";

export class LightReactor implements IReceiveLight{
    lightReceiverTransformNode(): TransformNode {
        return new TransformNode("dqs")
    }

    receiveLight(): void {
        // throw new Error("Not implemented");
    }

    stopReceivingLight(): void {
        // throw new Error("Not implemented");
    }



}