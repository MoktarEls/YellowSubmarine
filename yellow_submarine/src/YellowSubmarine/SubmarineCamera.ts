import {Submarine} from "@/YellowSubmarine/Submarine";
import {FollowCamera, PointerEventTypes, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class SubmarineCamera {
    get keyInputMap(): { [p: string]: boolean } {
        return this._keyInputMap;
    }
    get camera(): FollowCamera {
        return this._camera;
    }

    private _keyInputMap : {[key:string]: boolean} = {};

    private _camera : FollowCamera;
    private _isPointerLocked = false;
    private _sensitivity = 1.0;

    constructor(name: string, position: Vector3, private _submarine: Submarine) {
        this._camera = new FollowCamera(name, position, Game.WorldScene, _submarine.mesh);
        this._camera.lockedTarget = this._submarine.mesh;
        this._camera.radius = 10;
        this._camera.heightOffset = 3;

        const canvas = Game.Engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === canvas;
            });
        }

        Game.WorldScene.onPointerObservable.add((pointerInfo) => {
            if (this._isPointerLocked && pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                const event = pointerInfo.event as PointerEvent;
                const deltaX = event.movementX;
                const deltaY = event.movementY;

                this._camera.rotationOffset += deltaX * this._sensitivity;
                this._camera.heightOffset += deltaY * this._sensitivity;

                // Limites pour éviter des angles extrêmes
                this._camera.heightOffset = Math.max(1, Math.min(10, this._camera.heightOffset));
            }
        });
        this.setControls();
        this._camera.attachControl(false);
        this._camera.inputs.clear();

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