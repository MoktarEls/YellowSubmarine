import {Game} from "@/YellowSubmarine/Game";
import {Angle, KeyboardEventTypes, KeyboardInfo, Observable, Scalar} from "@babylonjs/core";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";

type CameraRotationInfo = {movementX: number, movementY: number};

export class Player {


    private static _instance: Player;
    private static _onCameraRotationObservable: Observable<CameraRotationInfo> = new Observable();
    private static _onPlayerPressedAKey: Observable<KeyboardInfo> = new Observable();
    private static _playerCameraConfiguration: CameraConfiguration = new CameraConfiguration();
    private static _horizontalCameraSensitivity = 5;
    private static _verticalCameraSensitivity = 5;
    private static _isMovementEnabled = true;


    public static get instance() {
        return this._instance;
    }

    public static get onCameraRotationObservable(){
        return this._onCameraRotationObservable;
    }

    public static get onPlayerPressedAKey(): Observable<KeyboardInfo> {
        return this._onPlayerPressedAKey;
    }

    public static get playerCameraConfiguration(): CameraConfiguration {
        return this._playerCameraConfiguration;
    }

    private static _isForwardPressed = false;
    private static _isBackwardPressed = false;
    private static _isLeftPressed = false;
    private static _isRightPressed = false;

    constructor() {
        Player._instance = this;
        Player.initializeCameraParameter();
        Player.registerKeyboardInputs();
        Player.registerMouseMovementInputs();
        Conversation.onAnyConversationStart.add(() => Player.disableMovement());
        Conversation.onAnyConversationEnd.add(() => Player.enableMovement());
    }

    public static isMoveForwardPressed(): boolean {
        return this._isForwardPressed && this._isMovementEnabled;
    }

    public static isMoveBackwardPressed(): boolean {
        return this._isBackwardPressed && this._isMovementEnabled;
    }

    public static isTurnLeftPressed(): boolean {
        return this._isLeftPressed && this._isMovementEnabled;
    }

    public static isTurnRightPressed(): boolean {
        return this._isRightPressed && this._isMovementEnabled;
    }

    private static registerKeyboardInputs(){
        const scene = Game.scene;
        scene.onKeyboardObservable.add( (eventData) => {
            if(Game.isGameFocused){
                const state = eventData.type === KeyboardEventTypes.KEYDOWN;
                if(eventData.event.code === "KeyW"){
                    this._isForwardPressed = state;
                }
                else if(eventData.event.code === "KeyS"){
                    this._isBackwardPressed = state;
                }
                else if(eventData.event.code === "KeyA"){
                    this._isLeftPressed = state;
                }
                else if(eventData.event.code === "KeyD"){
                    this._isRightPressed = state;
                }
                this.onPlayerPressedAKey.notifyObservers(eventData);

            }
        } );
    }

    private static registerMouseMovementInputs() {
        const scene = Game.scene;
        scene.onPointerObservable.add((pointerInfo) => {
            if(Game.isGameFocused){
                const event = pointerInfo.event as PointerEvent;
                const movementX = event.movementX/window.screen.width;
                const movementY = event.movementY/window.screen.height;
                this._onCameraRotationObservable.notifyObservers({movementX, movementY});
                this.updateCameraParameter(movementX, movementY);
            }
        })
    }

    public static enableMovement(){
        this._isMovementEnabled = true;
    }

    public static disableMovement(){
        this._isMovementEnabled = false;
    }

    private static initializeCameraParameter() {
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

    private static updateCameraParameter(movementX: number, movementY: number) {
        this._playerCameraConfiguration.wantedAlpha = Scalar.LerpAngle(this._playerCameraConfiguration.wantedBeta, this._playerCameraConfiguration.wantedAlpha - movementX * this._horizontalCameraSensitivity, 1);
        this._playerCameraConfiguration.wantedBeta = Scalar.LerpAngle(this._playerCameraConfiguration.wantedBeta, this._playerCameraConfiguration.wantedBeta - movementY * this._verticalCameraSensitivity, 1);

    }

    private static isCurrentCamera(){
        return ConfigurableCamera.instance.cameraConfiguration == this._playerCameraConfiguration;
    }
}