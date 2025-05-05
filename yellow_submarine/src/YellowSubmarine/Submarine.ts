import {Mesh, MeshBuilder, Quaternion, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {Game} from "@/YellowSubmarine/Game";


export class Submarine {

    private _mesh: Mesh;
    private _testForwardMesh: Mesh = MeshBuilder.CreateSphere("testForwardMesh");

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _submarineCamera: SubmarineCamera;

    //Movement
    private speed = 10;
    private velocity = new Vector3(0, 0, 0);
    private acceleration = 0.01;
    private friction = 0.99;

    private rotationSpeed = 1.0;

    private isPointerLocked = false;

    constructor() {
        this._mesh = this.createMesh();
        this._submarineCamera = new SubmarineCamera("camera", new Vector3(0, 5, -10), this);
        Game.worldScene.onBeforeRenderObservable.add(() => this.update());
    }

    private createMesh(): Mesh {
        const mesh = MeshBuilder.CreateBox("player", {width: 2, depth: 4}, Game.worldScene);
        mesh.position = new Vector3(0, 0, 0);
        return mesh;
    }

    private update() {
        const deltaTime = Game.engine.getDeltaTime() / 1000;

        // Step 1: Calculate wanted forward direction (on XZ plane)
        const wantedForward = this._submarineCamera.camera.getDirection(Vector3.Forward())
        wantedForward.y = 0;
        wantedForward.normalize();

        this._testForwardMesh.position = this.mesh.position.add(wantedForward.scale(5));

        // Step 2: Smoothly rotate toward wantedForward
        const currentForward = this.mesh.forward.clone();
        currentForward.y = 0;
        currentForward.normalize();

        const moveDirection = new Vector3(0, 0, 0);

        if (this._submarineCamera.keyInputMap["ArrowUp"] || this._submarineCamera.keyInputMap["z"]) {
            moveDirection.addInPlace(this._mesh.forward);
        }
        if (this._submarineCamera.keyInputMap["ArrowDown"] || this._submarineCamera.keyInputMap["s"]) {
            moveDirection.subtractInPlace(this._mesh.forward);
        }
        if (this._submarineCamera.keyInputMap["ArrowLeft"] || this._submarineCamera.keyInputMap["q"]) {
            moveDirection.subtractInPlace(this._mesh.right);
        }
        if (this._submarineCamera.keyInputMap["ArrowRight"] || this._submarineCamera.keyInputMap["d"]) {
            moveDirection.addInPlace(this._mesh.right);
        }

        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            this.velocity = this.velocity.add(moveDirection.scale(this.acceleration));
        }

        this.velocity = this.velocity.scale(this.friction);

        this._mesh.position.addInPlace(this.velocity.scale(this.speed * deltaTime));
    }

}