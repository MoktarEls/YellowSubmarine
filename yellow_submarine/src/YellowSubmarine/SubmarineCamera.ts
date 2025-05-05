import {Submarine} from "@/YellowSubmarine/Submarine";
import {Angle, ArcRotateCamera, Camera, PointerEventTypes, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class SubmarineCamera {
    get camera(): Camera {
        return this._camera;
    }

    private readonly _camera : ArcRotateCamera;
    private _keyInputMap: { [key: string]: boolean } = {};
    private _horizontalSensitivity = 0.05;
    private _verticalSensitivity = 0.05;
    private _isPointerLocked = false;

    constructor(private _submarine: Submarine) {
        this._camera = new ArcRotateCamera("submarineCamera", 1, Angle.FromDegrees(100).radians(), 20, this._submarine.mesh.position );
        this._camera.lowerBetaLimit = Angle.FromDegrees(55).radians();
        this._camera.upperBetaLimit = Angle.FromDegrees(80).radians();

        const canvas = Game.engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === canvas;
            });
        }

        Game.worldScene.onPointerObservable.add((pointerInfo) => {
            if (this._isPointerLocked && pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                const event = pointerInfo.event as PointerEvent;
                const deltaTimeInSec = Game.engine.getDeltaTime() / 1000;
                const deltaX = event.movementX;
                const deltaY = event.movementY;

                this._camera.alpha -= deltaX * this._horizontalSensitivity * deltaTimeInSec;
                this._camera.beta -= deltaY * this._verticalSensitivity * deltaTimeInSec;

            }
        });
        this.setControls();
        this.camera.attachControl(false);
        this.camera.inputs.clear();

    }

    private setControls() {
        window.addEventListener("keydown", (event) => {
            this._keyInputMap[event.key] = true;
        });
        window.addEventListener("keyup", (event) => {
            this._keyInputMap[event.key] = false;
        });
    }


}