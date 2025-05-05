import { Axis, Engine, FollowCamera, Mesh, MeshBuilder, Scene, Vector3, PointerEventTypes } from "@babylonjs/core";


export class Player {

    private scene : Scene;
    private engine : Engine;
    private mesh : Mesh;
    private camera : FollowCamera;
    private sensitivity = 0.05;

    //Physics
    private speed = 10;
    private velocity = new Vector3(0, 0, 0);
    private acceleration = 0.01;
    private friction = 0.99;

    //Le joueur a cliqué sur le canvas
    private isPointerLocked = false;

    private inputMap : Record<string, boolean>;

    constructor(scene : Scene, engine : Engine) {
        this.scene = scene;
        this.engine = engine;
        this.mesh = MeshBuilder.CreateBox("player", { size: 2 }, scene);
        this.mesh.position = new Vector3(0, 0, 0);

        this.camera = new FollowCamera("camera", new Vector3(0, 5, -10), scene);
        this.camera.lockedTarget = this.mesh;
        this.camera.radius = 10;
        this.camera.heightOffset = 3;
        this.camera.rotationOffset = 180;

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
                console.log("deltaX", event.movementX);
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
    
        const forward = this.camera.getFrontPosition(1).subtract(this.mesh.position);
        forward.y = 0;
        forward.normalize();
    
        const right = Vector3.Cross(Axis.Y, forward).normalize();
    
        const moveDirection = new Vector3(0, 0, 0);
    
        if (this.inputMap["ArrowUp"] || this.inputMap["z"]) {
            moveDirection.subtractInPlace(forward);
        }
        if (this.inputMap["ArrowDown"] || this.inputMap["s"]) {
            moveDirection.addInPlace(forward);
        }
        if (this.inputMap["ArrowLeft"] || this.inputMap["q"]) {
            moveDirection.addInPlace(right);
        }
        if (this.inputMap["ArrowRight"] || this.inputMap["d"]) {
            moveDirection.subtractInPlace(right);
        }
    
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            this.velocity = this.velocity.add(moveDirection.scale(this.acceleration));
        }
    
        this.velocity = this.velocity.scale(this.friction);
    
        this.mesh.position.addInPlace(this.velocity.scale(this.speed * deltaTime));
    }
    
}