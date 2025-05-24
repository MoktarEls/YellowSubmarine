import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {
    Angle,
    Mesh,
    PBRMaterial,
    PhysicsAggregate,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType,
    Quaternion,
    Space,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import {Utils} from "@/YellowSubmarine/Utils";
import {NPCFactory} from "@/YellowSubmarine/npcs/NPCFactory";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {Game} from "@/YellowSubmarine/Game";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class KeyZoneFactory {

    public static async createDolphinIsland(): Promise<KeyZone> {
        const _transformIsland: TransformNode = new TransformNode("island transform");
        const island = new KeyZone();

        island.name = "Dolphin island";
        island.detectionZone = new SphericalDetectionZone({
            diameter : 200
        }, true);

        const result = await Utils.loadMesh("models/scenes/dolphinIsland.glb");
        const rootMesh = result.meshes[0];
        const islandPosition = new Vector3(0,0,60);
        rootMesh.position = islandPosition;
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
            island.mesh = mergedMesh;
            island.mesh.parent = _transformIsland;
            island.physicsAggregate = this.createStaticPhysicsAggregate(island.mesh, PhysicsShapeType.MESH);

            island.physicsAggregate.body.setMotionType(PhysicsMotionType.STATIC);
            island.physicsAggregate.body.setTargetTransform(islandPosition, Quaternion.Identity());

            NPCFactory.createPedro().then( (pedro) => {
                pedro.transformNode.position = new Vector3(-30, 15, -14).add(islandPosition);
                pedro.transformNode.parent = _transformIsland;
            });
        }


        /*island.physicsAggregate = new PhysicsAggregate(island.mesh, PhysicsShapeType.SPHERE, {
            mass: 0,
            radius: 30,
        }, Game.scene);*/


        return island;
    }

    public static async createTemple(){

        const templeTransform: TransformNode = new TransformNode("temple transform");
        const temple = new KeyZone();

        temple.name = "Temple";
        temple.detectionZone = new SphericalDetectionZone({
            diameter : 500,
        }, true);

        const result = await Utils.loadMesh("models/scenes/temple.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = templeTransform;
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
            mergedMesh.parent = templeTransform;
            temple.mesh = mergedMesh;
            temple.physicsAggregate = this.createStaticPhysicsAggregate(temple.mesh, PhysicsShapeType.MESH);
            temple.physicsAggregate.body.setMotionType(PhysicsMotionType.STATIC);
            // TODO x:0 y:0 z:500
            templeTransform.position = new Vector3(0,0,60);
            templeTransform.rotate(Vector3.Up(), Angle.FromDegrees(180).radians(), Space.WORLD);
        }

        const steleDetectionZone = new SphericalDetectionZone({
            diameter: 10
        }, true);
        steleDetectionZone.zone.parent = templeTransform;
        steleDetectionZone.zone.position = new Vector3(0,0,50);
        Submarine.instance.meshCreationPromise.then((mesh) => {
            steleDetectionZone.addMeshToDetect(mesh);
        });
        steleDetectionZone.onMeshEnter.add(() => console.log('Stele in range'));
        steleDetectionZone.onMeshExit.add(() => console.log('Stele out of range'));
        temple.detectionZone = steleDetectionZone;

    }

    private static createStaticPhysicsAggregate(
        transformNode: TransformNode,
        type: PhysicsShapeType | PhysicsShape,
    ){
        const aggregate = new PhysicsAggregate(transformNode, type, {
            mass: 0,
        }, Game.scene);

        return aggregate;
    }

}