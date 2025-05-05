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
import {Game} from "@/YellowSubmarine/Game";


export class Submarine {

    private _mesh : Mesh;
    public get mesh(): Mesh {
        return this._mesh;
    }

    private _submarineCamera : SubmarineCamera;

    //Movement
    private speed = 10;
    private velocity = new Vector3(0, 0, 0);
    private acceleration = 0.01;
    private friction = 0.99;

    private wantedForward:Vector3 = Vector3.Forward();
    private rotationSpeed = 1.0;

    private isPointerLocked = false;

    constructor() {
        this._mesh = this.createMesh();
        this._submarineCamera = new SubmarineCamera("camera", new Vector3(0, 5, -10), this);
        Game.worldScene.onBeforeRenderObservable.add(() => this.update());
    }

    private createMesh() : Mesh{
        const mesh = MeshBuilder.CreateBox("player", { width: 2, depth: 4 }, Game.worldScene);
        mesh.position = new Vector3(0, 0, 0);
        return mesh;
    }

    private update() {
        const deltaTime = Game.engine.getDeltaTime() / 1000;

// Step 1: Calculate wanted forward direction (on XZ plane)
        this.wantedForward = this._submarineCamera.camera.getFrontPosition(1).subtract(this._mesh.position);
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

        if (this._submarineCamera.keyInputMap["ArrowUp"] || this._submarineCamera.keyInputMap["z"]) {
            moveDirection.subtractInPlace(this._mesh.forward);
        }
        if (this._submarineCamera.keyInputMap["ArrowDown"] || this._submarineCamera.keyInputMap["s"]) {
            moveDirection.addInPlace(this._mesh.forward);
        }
        if (this._submarineCamera.keyInputMap["ArrowLeft"] || this._submarineCamera.keyInputMap["q"]) {
            moveDirection.addInPlace(this._mesh.right);
        }
        if (this._submarineCamera.keyInputMap["ArrowRight"] || this._submarineCamera.keyInputMap["d"]) {
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