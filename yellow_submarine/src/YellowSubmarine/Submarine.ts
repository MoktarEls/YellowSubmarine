import {Angle, Mesh, MeshBuilder, Scalar, Scene, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {KeyboardEventManager} from "@/YellowSubmarine/KeyboardEventManager";
import {Game} from "@/YellowSubmarine/Game";
import {CartoonShaderMaterial} from "@/YellowSubmarine/CartoonShaderMaterial";
import {World} from "@/YellowSubmarine/World";

export class Submarine {
    public get mesh(): Mesh {
        return this._mesh;
    }

    private static _instance: Submarine;
    private _mesh : Mesh;

    private _testMesh ;

    private _movementSpeed = 5;
    private _currentMovementSpeed = 0;
    private _acceleration = 3;

    private _rotationSpeed = Angle.FromDegrees(90).radians();
    private _currentRotationSpeed = 0;
    private _rotationAcceleration = Angle.FromDegrees(60).radians();

    private _submarineCamera: SubmarineCamera;

    constructor(private _world: World) {
        this._mesh = new Mesh("");
        this._testMesh = new Mesh("");
        Submarine._instance = this;
        this._submarineCamera = new SubmarineCamera(this);
    }

    public init(){
        this._mesh = this.createMesh(this._world.scene)
        this._testMesh = MeshBuilder.CreateSphere("testMesh", {}, this._world.scene);
        this._testMesh.material = new CartoonShaderMaterial().shaderMaterial;
        this._submarineCamera.init();
        Game.registerUpdateAction(this.update, this);
    }

    private createMesh(scene: Scene): Mesh {
        const mesh = MeshBuilder.CreateBox("player", {width: 2, depth: 4}, scene);
        mesh.position = new Vector3(0, 0, 0);
        mesh.material = new CartoonShaderMaterial().shaderMaterial;
        return mesh;
    }

    private update(deltaTimeInSec: number) {
        this._testMesh.position = this.mesh.position.add(this.mesh.forward.scale(3));
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
        this.mesh.rotation.y = this.mesh.rotation.y + deltaTimeInSec * this._currentRotationSpeed;
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