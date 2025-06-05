import {Game} from "@/YellowSubmarine/Game";
import {Angle, KeyboardEventTypes, KeyboardInfo, Observable, PointerInfo, Scalar} from "@babylonjs/core";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";

type CameraRotationInfo = {movementX: number, movementY: number};

export class Player {

    private _playerCameraConfiguration: CameraConfiguration = new CameraConfiguration();
    private _horizontalCameraSensitivity = 5;
    private _verticalCameraSensitivity = 5;
    private _isMovementEnabled = true;

    private _onAnyKeyIsPressedObservable: Observable<KeyboardInfo> = new Observable();
    private _onMouseWheelScrolledObservable: Observable<WheelEvent> = new Observable();
    private _onPointerObservable: Observable<PointerInfo> = new Observable();

    private _isForwardPressed = false;
    private _isBackwardPressed = false;
    private _isLeftPressed = false;
    private _isRightPressed = false;

    public get playerCameraConfiguration(): CameraConfiguration {
        return this._playerCameraConfiguration;
    }

    constructor() {
        this.initializeCameraParameter();
        this.registerKeyboardInputs();
        this.registerPointerInputs();
        this.registerMouseWheelInputs();
        Dialogue.onBeforeAnyDialogueStartObservable.add(() => this.disableMovement());
        Dialogue.onBeforeAnyDialogueEndObservable.add(() => this.enableMovement());
    }

    public isMoveForwardPressed(): boolean {
        return this._isForwardPressed && this._isMovementEnabled;
    }

    public isMoveBackwardPressed(): boolean {
        return this._isBackwardPressed && this._isMovementEnabled;
    }

    public isTurnLeftPressed(): boolean {
        return this._isLeftPressed && this._isMovementEnabled;
    }

    public isTurnRightPressed(): boolean {
        return this._isRightPressed && this._isMovementEnabled;
    }

    public enableMovement(){
        this._isMovementEnabled = true;
    }

    public disableMovement(){
        this._isMovementEnabled = false;
    }

    private registerKeyboardInputs(){
        const scene = Game.scene;
        scene.onKeyboardObservable.add( (keyboardInfo) => {
            if(Game.isGameFocused){
                const state = keyboardInfo.type === KeyboardEventTypes.KEYDOWN;
                switch(keyboardInfo.event.code){
                    case "KeyW":
                        this._isForwardPressed = state;
                        break;
                    case "KeyS":
                        this._isBackwardPressed = state;
                        break;
                    case "KeyA":
                        this._isLeftPressed = state;
                        break;
                    case "KeyD":
                        this._isRightPressed = state;
                        break;

                }
                this._onAnyKeyIsPressedObservable.notifyObservers(keyboardInfo);
            }
        });

    }

    private registerPointerInputs() {
        const scene = Game.scene;
        scene.onPointerObservable.add((pointerInfo) => {
            if(Game.isGameFocused){
                this._onPointerObservable.notifyObservers(pointerInfo);
                this.updateCameraParameter(pointerInfo);
            }
        })
    }

    private initializeCameraParameter() {
        Submarine.instance.meshCreationPromise.then((mesh) => {
            this._playerCameraConfiguration.target = mesh;
            this._playerCameraConfiguration.distanceFromTarget = 25;
            this._playerCameraConfiguration.currentLowerBetaLimit = Angle.FromDegrees(30).radians();
            this._playerCameraConfiguration.currentUpperBetaLimit = Angle.FromDegrees(85).radians();
            this._playerCameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();
            this._playerCameraConfiguration.wantedBeta = Angle.FromDegrees(45).radians();
            ConfigurableCamera.instance.cameraConfiguration = this._playerCameraConfiguration;
        })
    }

    private updateCameraParameter(pointerInfo: PointerInfo) {
        const event = pointerInfo.event as PointerEvent;
        const movementX = event.movementX/window.screen.width;
        const movementY = event.movementY/window.screen.height;
        this._playerCameraConfiguration.wantedAlpha = Scalar.LerpAngle(this._playerCameraConfiguration.wantedBeta, this._playerCameraConfiguration.wantedAlpha - movementX * this._horizontalCameraSensitivity, 1);
        this._playerCameraConfiguration.wantedBeta = Scalar.LerpAngle(this._playerCameraConfiguration.wantedBeta, this._playerCameraConfiguration.wantedBeta - movementY * this._verticalCameraSensitivity, 1);

    }

    private registerMouseWheelInputs() {
        const canvas = Game.canvas;
        canvas.addEventListener("wheel", (event: WheelEvent) => {
            if(Game.isGameFocused){
                this._onMouseWheelScrolledObservable.notifyObservers(event);
            }
        });
    }
}