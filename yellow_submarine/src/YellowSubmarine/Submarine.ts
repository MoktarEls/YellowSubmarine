import {
    AbstractMesh,
    Angle,
    Mesh, PBRMaterial,
    Scalar,
    Scene,
    SceneLoader,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import "@babylonjs/loaders/glTF"
import {Player} from "@/YellowSubmarine/Player";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";

export class Submarine {

    public get mesh(): AbstractMesh{
        return this._mesh;
    }

    public static get instance(): Submarine {
        return this._instance;
    }

    private static _instance: Submarine;
    private _mesh!: AbstractMesh;

    private _movementSpeed = 8;
    private _currentMovementSpeed = 0;
    private _acceleration = 6;

    private _rotationSpeed = Angle.FromDegrees(270).radians();
    private _currentRotationSpeed = 0;
    private _rotationAcceleration = Angle.FromDegrees(270).radians();

    public meshCreationPromise: Promise<AbstractMesh>;

    constructor() {
        Submarine._instance = this;
        this.meshCreationPromise = this.createMesh(Game.scene);
        Game.scene.onBeforeRenderObservable.add(() => {
            this.update(Game.engine.getDeltaTime() / 1000);
        })
    }

    private async createMesh(scene: Scene) {
        const result = await SceneLoader.ImportMeshAsync("", "models/objects/", "submarine.glb", scene);
        this._mesh = result.meshes[0] as Mesh;
        result.meshes.forEach((mesh) => {
            const mat = mesh.material as PBRMaterial;
            if(mat){
                const toonShader = new CartoonShaderMaterial();
                    toonShader.assignMaterial(mesh).then( () => {
                        toonShader.configureFromPBRMaterial(mat);
                    }
                );
            }

        })
        this._mesh.name = "submarine";
        this._mesh.position = new Vector3(0, 0, 0);
        return this._mesh;
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
        if(this.mesh){
            this.mesh.rotateAround(this.mesh.position, Vector3.Up(), deltaTimeInSec * this._currentRotationSpeed);
        }
    }

    private updatePosition(deltaTimeInSec: number) {
        if(this.mesh){
            this.mesh.locallyTranslate(Vector3.Forward().scale(deltaTimeInSec * this._currentMovementSpeed));
        }
    }

    private isForwardPressed() {
        return Player.isMoveForwardPressed();
    }

    private isBackwardPressed() {
        return Player.isMoveBackwardPressed();
    }

    private isRightPressed() {
        return Player.isTurnRightPressed();
    }

    private isLeftPressed() {
        return Player.isTurnLeftPressed();
    }


}