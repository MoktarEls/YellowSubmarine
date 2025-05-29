import {
    AbstractMesh, Color3, KeyboardEventTypes,
    Mesh, MeshBuilder, PBRMaterial, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType,
    Scene,
    SceneLoader, SpotLight, StandardMaterial, Texture,
    Vector3, VolumetricLightScatteringPostProcess,
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import "@babylonjs/loaders/glTF"
import {Player} from "@/YellowSubmarine/Player";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {Grappler} from "@/YellowSubmarine/grappling system/Grappler";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";

export class Submarine {
    private _physicsAggregate?: PhysicsAggregate;

    public get mesh(): AbstractMesh{
        return this._mesh;
    }

    public static get instance(): Submarine {
        return this._instance;
    }

    private static _instance: Submarine;
    private _mesh!: AbstractMesh;

    private _movementForce = 3000000;

    private _rotationForce = 500000;
    private _grappler: Grappler;

    public meshCreationPromise: Promise<AbstractMesh>;

    private _spotLight?: SpotLight;

    constructor() {
        Submarine._instance = this;
        this._grappler = new Grappler();
        this.meshCreationPromise = this.createMesh(Game.scene);
        this.meshCreationPromise.then((mesh) => {
            this._grappler.owner = mesh.physicsBody ?? undefined;
            this._spotLight = this.createSpotlight();
            this.addVolumetricLight();


            const mapLimit = 1024;
            Game.scene.onBeforeRenderObservable.add(() => {
                if (!this._physicsAggregate) return;

                const body = this._physicsAggregate.body;
                const pos = body.transformNode.position.clone();

                if (pos.x > mapLimit || pos.x < -mapLimit || pos.z > mapLimit || pos.z < -mapLimit) {
                    body.setLinearVelocity(body.getLinearVelocity().negate());
                    body.transformNode.position.copyFrom(pos);
                }
            });
        });
        Game.scene.onBeforeRenderObservable.add(() => {
            this.update(/*Game.engine.getDeltaTime() / 1000*/);

        });

        const keysDown = new Set<string>();
        Game.scene.onKeyboardObservable.add((eventData) => {
            const key = eventData.event.key;
            if (key === "k") {
                if (eventData.type === KeyboardEventTypes.KEYDOWN) {
                    if (!keysDown.has(key)) {
                        keysDown.add(key);
                        SoundManager.instance.playSFX("submarine_horn", {
                            loop : true
                        }, this.mesh);
                    }
                } else if (eventData.type === KeyboardEventTypes.KEYUP) {
                    keysDown.delete(key);
                    SoundManager.instance.stopSFX("submarine_horn");
                }
            }
        });

        Game.scene.onKeyboardObservable.add((eventData) => {
            const key = eventData.event.key;
            if(key === "z" || key === "s"){
                if (eventData.type === KeyboardEventTypes.KEYDOWN) {
                    if (!keysDown.has(key)) {
                        keysDown.add(key);
                        SoundManager.instance.playSFX("submarine", {
                            loop : true
                        });
                    }
                } else if (eventData.type === KeyboardEventTypes.KEYUP) {
                    keysDown.delete(key);
                    SoundManager.instance.stopSFX("submarine");
                }
            }
        });

        Game.scene.onKeyboardObservable.add( (eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "l" && state){
                this._spotLight?.setEnabled(!this._spotLight?.isEnabled())
            }
        });
    }

    public get templeBall(): TempleBall | undefined {
        return this._grappler.grappledObject;
    }

    public grabBall(ball: TempleBall): void {
        this._grappler.grappleObject(ball);
    }

    public letGoOfBall(){
        this._grappler.letGoOfObject();
    }

    private async createMesh(scene: Scene) {
        const result = await SceneLoader.ImportMeshAsync("", "models/objects/", "submarine.glb", scene);
        const rootMesh = result.meshes[0] as Mesh;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const mat = mesh.material as PBRMaterial;
            if(mat){
                const toonMat = new CartoonShaderMaterial();
                await toonMat.assignMaterial(mesh).then(() => {
                    toonMat.configureFromPBRMaterial(mat);
                });
            }
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            this._mesh = mergedMesh;
            this._physicsAggregate = new PhysicsAggregate(this._mesh, PhysicsShapeType.BOX,{
                mass: 1,
                friction: 0,
                restitution: 0,
                mesh: mergedMesh,
            }, Game.scene);
            this._physicsAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
            this._physicsAggregate.body.setMassProperties({
                inertia: new Vector3(0, 1, 0),
                centerOfMass: this._mesh.absolutePosition,
            });
            this._physicsAggregate.body.setLinearDamping(1);
            this._physicsAggregate.body.setAngularDamping(1);
            this._physicsAggregate.body.getCollisionObservable();

            this._mesh.name = "submarine";
            this._mesh.position = new Vector3(0, 0, 0);
        }
        this.mesh.receiveShadows = true;
        return this._mesh;
    }


    private createSpotlight() {
        const spotLight = new SpotLight("spotLight",
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 1),
            Math.PI / 3,
            2,
            Game.scene
        );
        spotLight.diffuse = new Color3(1, 1, 1);
        spotLight.specular = new Color3(1, 1, 1);
        spotLight.intensity = 5000;
        spotLight.parent = this._mesh;
        spotLight.setEnabled(false);

        this._spotLight = spotLight;
        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if (eventData.event.key === "l" && state) {
                const enabled = !this._spotLight?.isEnabled();
                this._spotLight?.setEnabled(enabled);
            }
        });

        return spotLight;
    }

    private addVolumetricLight() {
        const camera = Game.scene.activeCamera!;

        const lightEmitter = MeshBuilder.CreateSphere("lightEmitter", {diameter: 0.8}, Game.scene);
        const vl = new VolumetricLightScatteringPostProcess("vls", 1.0, camera, lightEmitter);
        lightEmitter.position = new Vector3(0, 0, 2.3);
        lightEmitter.parent = this._mesh;

        const mat = new StandardMaterial("lightMat", Game.scene);
        mat.emissiveTexture = new Texture("textures/lensflare/lens5.png", Game.scene);
        mat.diffuseColor = new Color3(0, 0, 0);
        mat.specularColor = new Color3(0, 0, 0);
        mat.emissiveColor = new Color3(1, 1, 1);
        mat.alpha = 0.8;
        lightEmitter.material = mat;

        vl.mesh = lightEmitter;

        vl.exposure = 1;
        vl.decay = 0.96815;
        vl.weight = 0.4;
        vl.density = 0.99;

        lightEmitter.setEnabled(false);

        Game.scene.onKeyboardObservable.add((eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if (eventData.event.key === "l" && state) {
                lightEmitter.setEnabled(!lightEmitter.isEnabled());
            }
        });
    }

    private update() {
        this.updateRotationSpeed();
        this.updateMovementSpeed();
    }

    private updateMovementSpeed() {
            if (!this._physicsAggregate) return;

            const body = this._physicsAggregate.body;

            let direction = 0;
            if (this.isForwardPressed()) direction += 1;
            if (this.isBackwardPressed()) direction -= 1;

            if (direction === 0) return;

            body.applyForce(this._mesh.forward.scale(direction * this._movementForce), body.getObjectCenterWorld() );

        }

    private updateRotationSpeed() {
            if (!this._physicsAggregate) return;

            const body = this._physicsAggregate.body;

            let direction = 0;
            if (this.isRightPressed()) direction += 1;
            if (this.isLeftPressed()) direction -= 1;

            if(direction == 0) return;

            body.applyForce(this._mesh.right.scale(direction * this._rotationForce), body.getObjectCenterWorld().add(this._mesh.forward));

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