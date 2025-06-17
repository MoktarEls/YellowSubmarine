import { MeshBuilder, Vector3 } from "@babylonjs/core";
import { Game } from "@/YellowSubmarine/Game";
import { FishEntity } from "@/YellowSubmarine/entity system/FishEntity";

export class SchoolOfFish {
    private _schoolOfFish: FishEntity[] = [];

    private _globalDirection: Vector3 = new Vector3(1, 0, 0.3).normalize();

    private _center: Vector3;
    private _radius = 50;

    constructor(position: Vector3) {
        this._center = position;
        this.createSchoolOfFish(30);

        Game.scene.onBeforeRenderObservable.add(() => {
            this._globalDirection = Vector3.Lerp(
                this._globalDirection,
                new Vector3(Math.cos(performance.now() * 0.0001), 0, Math.sin(performance.now() * 0.0001)).normalize(),
                0.001
            );

            for (const fish of this._schoolOfFish) {
                // Alignement
                const alignFactor = 0.05;
                fish.velocity = Vector3.Lerp(fish.velocity, this._globalDirection, alignFactor);

                // Retour centre si hors zone
                const toCenter = this._center.subtract(fish.mesh.position);
                const distToCenter = toCenter.length();

                if (distToCenter > this._radius) {
                    const returnStrength = 0.1;
                    const dirToCenter = toCenter.normalize();
                    fish.velocity = Vector3.Lerp(fish.velocity, dirToCenter, returnStrength);
                }

                // Variation aléatoire légère
                const randomInfluence = new Vector3(
                    (Math.random() - 0.5) * 0.01,
                    0,
                    (Math.random() - 0.5) * 0.01
                );
                fish.velocity.addInPlace(randomInfluence);

                // Fixer y à 0 puis normaliser
                fish.velocity.y = 0;
                fish.velocity.normalize();

                // Mouvement et rotation
                fish.mesh.position.addInPlace(fish.velocity.scale(0.2));
                fish.mesh.rotation.y = Math.atan2(fish.velocity.x, fish.velocity.z);
            }
        });
    }

    private createFish(): FishEntity {
        const mesh = MeshBuilder.CreateBox("fish", {
            height: 0.2,
            width: 0.2,
            depth: 0.6,
        }, Game.scene);
        return new FishEntity(mesh);
    }

    private createSchoolOfFish(count: number) {
        for (let i = 0; i < count; i++) {
            const fish = this.createFish();
            fish.mesh.position = new Vector3(
                Math.random() * this._radius * 2 - this._radius + this._center.x,
                Math.random() * 10 + 2 + this._center.y,
                Math.random() * this._radius * 2 - this._radius + this._center.z
            );
            fish.mesh.rotation.y = Math.random() * Math.PI * 2;
            fish.velocity = this._globalDirection.clone();
            this._schoolOfFish.push(fish);
        }
    }
}
