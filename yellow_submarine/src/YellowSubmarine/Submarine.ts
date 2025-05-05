import {
    Axis,
    Engine,
    FollowCamera,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
    PointerEventTypes,
    Quaternion
} from "@babylonjs/core";


export class Submarine {

    private mesh : Mesh;
    private scene : Scene;
    private camera : FollowCamera;

    //Physics
    private sensitivity = 0.05;
    private speed = 10;
    private velocity = new Vector3(0, 0, 0);
    private acceleration = 0.01;
    private friction = 0.99;

    private wantedForward:Vector3 = Vector3.Forward();
    private rotationSpeed = 1.0;

    //Le joueur a cliqué sur le canvas
    private isPointerLocked = false;

    private inputMap : Record<string, boolean>;

    constructor(scene : Scene, engine : Engine) {
        this.scene = scene;
        this.mesh = MeshBuilder.CreateTiledBox("player", { height: 2, width: 4 }, scene);
        this.mesh.position = new Vector3(0, 0, 0);

        this.camera = new FollowCamera("camera", new Vector3(0, 5, -10), scene);
        this.camera.lockedTarget = this.mesh;
        this.camera.radius = 10;
        this.camera.heightOffset = 3;

        this.inputMap = {};
        this.setControls();
        this.camera.attachControl(false);
        this.camera.inputs.clear();

        const canvas = engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this.isPointerLocked = document.pointerLockElement === canvas;
            });
        }

        this.scene.onPointerObservable.add((pointerInfo) => {
            if (this.isPointerLocked && pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                const event = pointerInfo.event as PointerEvent;
                const deltaX = event.movementX;
                const deltaY = event.movementY;

                this.camera.rotationOffset += deltaX * this.sensitivity;
                this.camera.heightOffset += deltaY * this.sensitivity;

                // Limites pour éviter des angles extrêmes
                this.camera.heightOffset = Math.max(1, Math.min(10, this.camera.heightOffset));
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
        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

// Step 1: Calculate wanted forward direction (on XZ plane)
        this.wantedForward = this.camera.getFrontPosition(1).subtract(this.mesh.position);
        this.wantedForward.y = 0;
        this.wantedForward.normalize();

// Step 2: Smoothly rotate toward wantedForward
        const currentForward = this.mesh.forward.clone();
        currentForward.y = 0;
        currentForward.normalize();

// Get rotation quaternion from current to target direction
        const currentRotation = Quaternion.FromEulerAngles(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);
        const targetRotation = Quaternion.FromLookDirectionLH(this.wantedForward, Vector3.Up());

// Slerp between current and target rotation for smooth turning
        const rotationSpeed = 5; // Adjust to your needs
        const newRotation = Quaternion.Slerp(currentRotation, targetRotation, rotationSpeed * deltaTime);

        this.mesh.rotationQuaternion = newRotation;

// === Movement (no changes needed here) ===
        //const wantedRight = Vector3.Cross(Axis.Y, this.wantedForward).normalize();
        const moveDirection = new Vector3(0, 0, 0);

        if (this.inputMap["ArrowUp"] || this.inputMap["z"]) {
            moveDirection.subtractInPlace(this.mesh.forward);
        }
        if (this.inputMap["ArrowDown"] || this.inputMap["s"]) {
            moveDirection.addInPlace(this.mesh.forward);
        }
        if (this.inputMap["ArrowLeft"] || this.inputMap["q"]) {
            moveDirection.addInPlace(this.mesh.right);
        }
        if (this.inputMap["ArrowRight"] || this.inputMap["d"]) {
            moveDirection.subtractInPlace(this.mesh.right);
        }
    
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            this.velocity = this.velocity.add(moveDirection.scale(this.acceleration));
        }
    
        this.velocity = this.velocity.scale(this.friction);
    
        this.mesh.position.addInPlace(this.velocity.scale(this.speed * deltaTime));
    }
    
}