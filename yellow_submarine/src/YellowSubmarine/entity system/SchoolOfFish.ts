import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import { Game } from "@/YellowSubmarine/Game";
import { FishEntity } from "@/YellowSubmarine/entity system/FishEntity";
import {loadMesh} from "@/YellowSubmarine/Utils";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class SchoolOfFish {
    private _color: Record<number, string> = {
        1: "green",
        2: "blue",
        3: "red",
        4: "yellow",
    };
    private _schoolOfFish: FishEntity[] = [];

    private _globalDirection: Vector3 = new Vector3(1, 0, 0.3).normalize();

    private _center: Vector3;
    private _radius = 50;

    constructor(position: Vector3) {
        this._center = position;
        this.createSchoolOfFish(30);

        Game.scene.onBeforeRenderObservable.add(() => {
            if (Submarine.instance?.mesh) {
                this._center = Submarine.instance.mesh.position.clone();
            }

            for (const fish of this._schoolOfFish) {
                const toCenter = this._center.subtract(fish.mesh.position);
                const distToCenter = toCenter.length();

                // Retour vers le centre si trop loin
                if (distToCenter > this._radius) {
                    const returnStrength = 0.05;
                    const dirToCenter = toCenter.normalize();
                    fish.velocity = Vector3.Lerp(fish.velocity, dirToCenter, returnStrength);
                }

                // Ajout d'une direction de nage aléatoire
                const randomInfluence = new Vector3(
                    (Math.random() - 0.5) * 0.02,
                    0,
                    (Math.random() - 0.5) * 0.02
                );
                fish.velocity.addInPlace(randomInfluence);

                // Éviter d’aller trop vite / stabiliser
                fish.velocity.y = 0;
                fish.velocity.normalize();

                // Appliquer le mouvement
                fish.mesh.position.addInPlace(fish.velocity.scale(0.15));

                // Look dans la direction de la nage
                fish.mesh.lookAt(fish.mesh.position.add(fish.velocity));
            }
        });

    }

    private async createFish(): Promise<FishEntity> {
        const fish = new FishEntity();
        const index = Math.floor(Math.random() * 4) + 1;
        const color = this._color[index];
        const filename = `models/fish/${color}_fish.glb`;
        await loadMesh(filename).then((result) => {
            fish.mesh = result.meshes[0];
            if (result.animationGroups && result.animationGroups.length > 0) {
                result.animationGroups.forEach(group => group.start(true));
            }
        });
        return fish;
    }

    private createSchoolOfFish(count: number) {
        for (let i = 0; i < count; i++) {
            this.createFish().then((fish) => {
                fish.mesh.position = new Vector3(
                    Math.random() * this._radius * 2 - this._radius + this._center.x,
                    Math.random() * 10 + 2 + this._center.y,
                    Math.random() * this._radius * 2 - this._radius + this._center.z
                );
                fish.mesh.rotation.y = Math.random() * Math.PI * 2;
                fish.velocity = this._globalDirection.clone();
                this._schoolOfFish.push(fish);
            });
        }
    }
}
