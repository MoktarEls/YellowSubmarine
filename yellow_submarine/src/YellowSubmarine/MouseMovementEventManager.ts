import {Scene} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

type MouseMovementAction = (
    movementX: number,
    movementY: number,
) => void;

export class MouseMovementEventManager {

    private static _instance: MouseMovementEventManager;

    private _mouseMovementActions: Set<MouseMovementAction> = new Set();

    constructor(private _game: Game) {
        MouseMovementEventManager._instance = this;
    }

    public init() {
        this.activateMouseMovementEventTrigger();
    }

    private get scene(): Scene {
        return this._game.scene;
    }

    public static registerMouseMovement(action: MouseMovementAction, context?: any){
        const boundAction = context ? action.bind(context) : action;
        this._instance._mouseMovementActions.add(boundAction);
        return boundAction;
    }

    public static unregisterMouseMovement(action: MouseMovementAction){
        this._instance._mouseMovementActions.delete(action);
    }

    private activateMouseMovementEventTrigger(){
        this.scene.onPointerObservable.add((pointerInfo) => {

            const event = pointerInfo.event as PointerEvent;
            const movementX = event.movementX;
            const movementY = event.movementY;
            if( (movementX !== 0 || movementY !== 0) && this._game.isPointerLocked()){
                this.notifyMouseMovement(movementX, movementY);
            }
        })
    }

    private notifyMouseMovement(movementX: number, movementY: number) {
        this._mouseMovementActions.forEach(action =>  action(movementX, movementY) );
    }
}