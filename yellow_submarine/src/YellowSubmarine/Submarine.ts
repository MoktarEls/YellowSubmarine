import {
    Engine,
    FollowCamera,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
    PointerEventTypes,
    Quaternion
} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";


export class Submarine {

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _mesh : Mesh;
    private _submarineCamera : SubmarineCamera;

    //Movement
    private speed = 10;
    private velocity = new Vector3(0, 0, 0);
    private acceleration = 0.01;
    private friction = 0.99;

    private wantedForward:Vector3 = Vector3.Forward();
    private rotationSpeed = 1.0;

    //Le joueur a cliqué sur le canvas
    private isPointerLocked = false;

    private inputMap : Record<string, boolean>;

    constructor() {
        this._submarineCamera = new SubmarineCamera(this);

        this._mesh = MeshBuilder.CreateBox("player", { width: 2, depth: 4 }, scene);
        this._mesh.position = new Vector3(0, 0, 0);

        this._submarineCamera = new FollowCamera("camera", new Vector3(0, 5, -10), scene);
        this._submarineCamera.lockedTarget = this._mesh;
        this._submarineCamera.radius = 10;
        this._submarineCamera.heightOffset = 3;

        this.inputMap = {};
        this.setControls();
        this._submarineCamera.attachControl(false);
        this._submarineCamera.inputs.clear();

        const canvas = engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this.isPointerLocked = document.pointerLockElement === canvas;
            });
        }

        this._scene.onPointerObservable.add((pointerInfo) => {
            if (this.isPointerLocked && pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                const event = pointerInfo.event as PointerEvent;
                const deltaX = event.movementX;
                const deltaY = event.movementY;

                this._submarineCamera.rotationOffset += deltaX * this.sensitivity;
                this._submarineCamera.heightOffset += deltaY * this.sensitivity;

                // Limites pour éviter des angles extrêmes
                this._submarineCamera.heightOffset = Math.max(1, Math.min(10, this._submarineCamera.heightOffset));
            }
        });
        scene.onBeforeRenderObservable.add(() => this.update());
    }

    private setControls() {
        window.addEventListener("keydown", (event) => {
            this.inputMap[event.key] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.inputMap[event.key] = false;
        });
    }

    private update() {
        const deltaTime = this._scene.getEngine().getDeltaTime() / 1000;

// Step 1: Calculate wanted forward direction (on XZ plane)
        this.wantedForward = this._submarineCamera.getFrontPosition(1).subtract(this._mesh.position);
        this.wantedForward.y = 0;
        this.wantedForward.normalize();

// Step 2: Smoothly rotate toward wantedForward
        const currentForward = this._mesh.forward.clone();
        currentForward.y = 0;
        currentForward.normalize();

// Get rotation quaternion from current to target direction
        const currentRotation = Quaternion.FromEulerAngles(this._mesh.rotation.x, this._mesh.rotation.y, this._mesh.rotation.z);
        const targetRotation = Quaternion.FromLookDirectionLH(this.wantedForward, Vector3.Up());

// Slerp between current and target rotation for smooth turning
        const rotationSpeed = 5; // Adjust to your needs
        const newRotation = Quaternion.Slerp(currentRotation, targetRotation, rotationSpeed * deltaTime);

        this._mesh.rotationQuaternion = newRotation;

// === Movement (no changes needed here) ===
        //const wantedRight = Vector3.Cross(Axis.Y, this.wantedForward).normalize();
        const moveDirection = new Vector3(0, 0, 0);

        if (this.inputMap["ArrowUp"] || this.inputMap["z"]) {
            moveDirection.subtractInPlace(this._mesh.forward);
        }
        if (this.inputMap["ArrowDown"] || this.inputMap["s"]) {
            moveDirection.addInPlace(this._mesh.forward);
        }
        if (this.inputMap["ArrowLeft"] || this.inputMap["q"]) {
            moveDirection.addInPlace(this._mesh.right);
        }
        if (this.inputMap["ArrowRight"] || this.inputMap["d"]) {
            moveDirection.subtractInPlace(this._mesh.right);
        }
    
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            this.velocity = this.velocity.add(moveDirection.scale(this.acceleration));
        }
    
        this.velocity = this.velocity.scale(this.friction);
    
        this._mesh.position.addInPlace(this.velocity.scale(this.speed * deltaTime));
    }
    
}