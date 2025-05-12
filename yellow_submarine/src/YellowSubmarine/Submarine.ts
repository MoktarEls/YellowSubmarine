import {Angle, Mesh, Scalar, Scene, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {Game} from "@/YellowSubmarine/Game";
import "@babylonjs/loaders/glTF"

export class Submarine {
    get submarineCamera(): SubmarineCamera {
        return this._submarineCamera;
    }
    public get mesh(): Mesh {
        return this._mesh;
    }

    public static get instance(): Submarine {
        return this._instance;
    }

    private static _instance: Submarine;
    private _mesh! : Mesh;

    private _movementSpeed = 5;
    private _currentMovementSpeed = 0;
    private _acceleration = 3;

    private _rotationSpeed = Angle.FromDegrees(90).radians();
    private _currentRotationSpeed = 0;
    private _rotationAcceleration = Angle.FromDegrees(60).radians();

    private _submarineCamera!: SubmarineCamera;

    constructor() {
        Submarine._instance = this;
        this.createMesh(Game.scene).then( () => {
                this._submarineCamera = new SubmarineCamera(this);
            }
        );

        // TODO : Make submarine a physics object instead
        Game.scene.onBeforeRenderObservable.add(() => {

        })
    }

    private async createMesh(scene: Scene) {
        const result = await SceneLoader.ImportMeshAsync("", "models/", "submarine.glb", scene);
        this._mesh = result.meshes[0] as Mesh;
        this._mesh.name = "submarine";
        this._mesh.position = new Vector3(0, 0, 0);
        this._mesh.material = new StandardMaterial("submarineMaterial", scene);
        // mesh.material = new CartoonShaderMaterial().shaderMaterial;
    }

    private update(deltaTimeInSec: number) {
        this.updateRotationSpeed(deltaTimeInSec);
        this.updateMovementSpeed(deltaTimeInSec);
        this.updateRotation(deltaTimeInSec);
        this.updatePosition(deltaTimeInSec);
    }

    private updateRotationSpeed(deltaTimeInSec: number) {
        let rotationSpeedTarget = 0;

        if(this.isRightPressed()){
            rotationSpeedTarget += this._rotationSpeed;
        }
        if(this.isLeftPressed()){
            rotationSpeedTarget -= this._rotationSpeed;
        }

        this._currentRotationSpeed = Scalar.MoveTowards(this._currentRotationSpeed, rotationSpeedTarget, deltaTimeInSec * this._rotationAcceleration);
    }

    private updateMovementSpeed(deltaTimeInSec: number) {
        let targetMovementSpeed = 0;
        if(this.isForwardPressed()){
            targetMovementSpeed += this._movementSpeed;
        }
        if(this.isBackwardPressed()){
            targetMovementSpeed -= this._movementSpeed;
        }
        this._currentMovementSpeed = Scalar.MoveTowards(this._currentMovementSpeed, targetMovementSpeed, deltaTimeInSec * this._acceleration);
    }

    private updateRotation(deltaTimeInSec: number) {
        this.mesh.rotateAround(this.mesh.position, Vector3.Up(), deltaTimeInSec * this._currentRotationSpeed);
    }

    private updatePosition(deltaTimeInSec: number) {
        this.mesh.locallyTranslate(Vector3.Forward().scale(deltaTimeInSec * this._currentMovementSpeed));
    }

    private isForwardPressed() {
        return KeyboardEventManager.isKeyPressed("z");
    }

    private isBackwardPressed() {
        return KeyboardEventManager.isKeyPressed("s");
    }

    private isRightPressed() {
        return KeyboardEventManager.isKeyPressed("d");
    }

    private isLeftPressed() {
        return KeyboardEventManager.isKeyPressed("q");
    }


}