import {Mesh, MeshBuilder} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";
import {Submarine} from "@/YellowSubmarine/Submarine";

export abstract class InteractableObject {
    zone: Mesh;
    mesh : Mesh;
    isPlayerInside = false;
    interactionTime = 0;

    protected constructor(private _world: World) {
        this.zone = MeshBuilder.CreateSphere("zone", {
            diameter : 2,
        })
        this.mesh = this.createMesh();
    }

    public init() {
        this.zone.visibility = 1;
        Game.scene.addMesh(this.mesh);
        Game.scene.addMesh(this.zone);

        this._world.scene.onBeforeRenderObservable.add(() => {
            const deltaTime = this._world.scene.getEngine().getDeltaTime();
            this.interactionTime += deltaTime;

            if (this.interactionTime >= 200) {
                this.checkZone();
                this.interactionTime = 0;
            }
        });
    }

    private checkZone() {
        const isInside = this.zone.intersectsMesh(Submarine.instance.mesh, true);
        if (isInside) {
            this.onPlayerEnter();
        } else if (!isInside ) {
            this.onPlayerExit();
        }
    }

    interact(): void {
        console.log("INTERACTION");
    }

    onPlayerEnter(): void {
        if(!this.isPlayerInside) {
            console.log("onPlayerEnter");
            this.isPlayerInside = true;
        }
    }

    onPlayerExit(): void {
        if(this.isPlayerInside) {
            console.log("onPlayerExit");
            this.isPlayerInside = false;
        }
    }

    private createMesh(): Mesh {
        return MeshBuilder.CreateBox("mesh", {
            width : 1,
            height : 1,
        });
    }
}