import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {PlayerCamera} from "@/YellowSubmarine/camera system/PlayerCamera";
import {World} from "@/YellowSubmarine/World";

type CameraRotationInfo = {movementX: number, movementY: number};

export class Player {

    private static _instance: Player;
    private static _onCameraRotationObservable: Observable<CameraRotationInfo> = new Observable();

    public static get instance() {
        return this._instance;
    }

    public static get onCameraRotationObservable(){
        return this._onCameraRotationObservable;
    }

    private static _isForwardPressed = false;
    private static _isBackwardPressed = false;
    private static _isLeftPressed = false;
    private static _isRightPressed = false;

    private static _playerCamera: PlayerCamera;

    constructor() {
        Player._instance = this;
        PlayerCamera.instance.followMesh(World.submarine.mesh);
        Player.registerKeyboardInputs();
        Player.registerMouseMovementInputs();
    }

    public static isMoveForwardPressed(): boolean {
        return this._isForwardPressed;
    }

    public static isMoveBackwardPressed(): boolean {
        return this._isBackwardPressed;
    }

    public static isTurnLeftPressed(): boolean {
        return this._isLeftPressed;
    }

    public static isTurnRightPressed(): boolean {
        return this._isRightPressed;
    }

    private static registerKeyboardInputs(){
        const scene = Game.scene;
        scene.onKeyboardObservable.add( (eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "z"){
                this._isForwardPressed = state;
            }
            else if(eventData.event.key === "s"){
                this._isBackwardPressed = state;
            }
            else if(eventData.event.key === "q"){
                this._isLeftPressed = state;
            }
            else if(eventData.event.key === "d"){
                this._isRightPressed = state;
            }
        } );
    }

    private static registerMouseMovementInputs() {
        const scene = Game.scene;
        scene.onPointerObservable.add((pointerInfo) => {

            const event = pointerInfo.event as PointerEvent;
            const movementX = event.movementX/window.screen.width;
            const movementY = event.movementY/window.screen.height;
            this._onCameraRotationObservable.notifyObservers({movementX, movementY});
        })
    }
}