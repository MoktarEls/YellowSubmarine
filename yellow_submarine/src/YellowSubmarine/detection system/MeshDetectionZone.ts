import {AbstractMesh, Observable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class MeshDetectionZone {

    private _zone : AbstractMesh
    public onMeshEnter : Observable<AbstractMesh>;
    public onMeshExit : Observable<AbstractMesh>;
    private _meshToDetect : Map<AbstractMesh, boolean>;

    public get zone(): AbstractMesh {
        return this._zone;
    }

    constructor(zone : AbstractMesh, debug ?: boolean) {
        this._zone = zone;
        this._zone.visibility = debug ? 0.5 : 0;
        this._meshToDetect = new Map<AbstractMesh, boolean>();
        this.onMeshEnter = new Observable<AbstractMesh>();
        this.onMeshExit = new Observable<AbstractMesh>();
        Game.scene.onBeforeRenderObservable.add(() => this.checkAll());
    }

    public addMeshToDetect(mesh : AbstractMesh) : void {
        this._meshToDetect.set(mesh, false);
        this.checkAll();
    }

    private checkDetection(mesh : AbstractMesh) : boolean {
        const state = this._zone.intersectsMesh(mesh, true);
        if (state !== this._meshToDetect.get(mesh)) {
            if(state) this.onMeshEnter.notifyObservers(mesh);
            else this.onMeshExit.notifyObservers(mesh);
            this._meshToDetect.set(mesh, state);
        }
        return state;
    }

    private checkAll(){
        this._meshToDetect.forEach((state, mesh) => {this.checkDetection(mesh)})
    }

}