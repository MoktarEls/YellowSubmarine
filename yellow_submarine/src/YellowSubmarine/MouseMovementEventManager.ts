import {Scene} from "@babylonjs/core";

type MouseMovementAction = (
    deltaXPixel: number,
    deltaYPixel: number,
    deltaXRatio: number,
    deltaYRatio: number
) => void;

export class MouseMovementEventManager {

    private static _scene: Scene;
    private static _mouseMovementActions: Set<MouseMovementAction> = new Set();

    constructor(scene: Scene) {
        MouseMovementEventManager._scene = scene;
    }

    public static registerMouseMovement(action: MouseMovementAction, context?: any){
        const boundAction = context ? action.bind(context) : action;
        this._mouseMovementActions.add(boundAction);
        return boundAction;
    }

    public static unregisterMouseMovement(action: MouseMovementAction){
        this._mouseMovementActions.delete(action);
    }


}