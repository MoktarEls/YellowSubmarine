import {Scene} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

type MouseMovementAction = (
    movementX: number,
    movementY: number,
) => void;

export class MouseMovementEventManager {

    private static _scene: Scene;
    private static _mouseMovementActions: Set<MouseMovementAction> = new Set();
    private static _isPointerLocked = false;

    constructor(scene: Scene) {
        MouseMovementEventManager._scene = scene;
        MouseMovementEventManager.handlePointerLocking();
        MouseMovementEventManager.activateMouseMovementEventTrigger();
    }

    public static registerMouseMovement(action: MouseMovementAction, context?: any){
        const boundAction = context ? action.bind(context) : action;
        this._mouseMovementActions.add(boundAction);
        return boundAction;
    }

    public static unregisterMouseMovement(action: MouseMovementAction){
        this._mouseMovementActions.delete(action);
    }

    private static activateMouseMovementEventTrigger(){
        this._scene.onPointerObservable.add((pointerInfo) => {

            const event = pointerInfo.event as PointerEvent;
            const movementX = event.movementX;
            const movementY = event.movementY;
            if( (movementX !== 0 || movementY !== 0) && this._isPointerLocked){
                this.notifyMouseMovement(movementX, movementY);
            }
        })
    }

    private static handlePointerLocking() {
        const canvas = Game.engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === canvas;
            });
        }
    }

    private static notifyMouseMovement(movementX: number, movementY: number) {
        this._mouseMovementActions.forEach(action =>  action(movementX, movementY) );
    }
}