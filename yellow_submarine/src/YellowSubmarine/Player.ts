import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes, Observable} from "@babylonjs/core";
import {PlayerCamera} from "@/YellowSubmarine/camera system/PlayerCamera";
import {World} from "@/YellowSubmarine/World";

type CameraRotationInfo = {movementX: number, movementY: number};

export class Player {

    private static _instance: Player;
    private _onCameraRotationObservable: Observable<CameraRotationInfo> = new Observable();

    public static get instance() {
        return this._instance;
    }

    public get onCameraRotationObservable(){
        return this._onCameraRotationObservable;
    }

    private _isForwardPressed = false;
    private _isBackwardPressed = false;
    private _isLeftPressed = false;
    private _isRightPressed = false;

    private _playerCamera: PlayerCamera;

    constructor() {
        Player._instance = this;
        this._playerCamera = new PlayerCamera();
        this._playerCamera.followMesh(World.submarine.mesh);
        this.registerKeyboardInputs();
        this.registerMouseMovementInputs();
    }

    public isMoveForwardPressed(): boolean {
        return this._isForwardPressed;
    }

    public isMoveBackwardPressed(): boolean {
        return this._isBackwardPressed;
    }

    public isTurnLeftPressed(): boolean {
        return this._isLeftPressed;
    }

    public isTurnRightPressed(): boolean {
        return this._isRightPressed;
    }

    private registerKeyboardInputs(){
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

    private registerMouseMovementInputs() {
        const scene = Game.scene;
        scene.onPointerObservable.add((pointerInfo) => {

            const event = pointerInfo.event as PointerEvent;
            const movementX = event.movementX/window.screen.width;
            const movementY = event.movementY/window.screen.height;
            this._onCameraRotationObservable.notifyObservers({movementX, movementY});
        })
    }
}