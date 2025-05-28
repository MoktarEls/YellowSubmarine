import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {
    Angle,
    Color3,
    Mesh,
    PBRMaterial,
    PhysicsAggregate,
    PhysicsBody,
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
import {Stele} from "@/YellowSubmarine/temple/Stele";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {TemplePuzzle} from "@/YellowSubmarine/temple/TemplePuzzle";
import {CellMaterial} from "@babylonjs/materials";

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
            mergedMesh.receiveShadows = true;

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
                toonMat.emissionColor = Color3.FromHexString("#4bf49f")
            }
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = templeTransform;
            temple.mesh = mergedMesh;
            templeTransform.position = new Vector3(0,0,500);
            templeTransform.rotate(Vector3.Up(), Angle.FromDegrees(180).radians(), Space.WORLD);

            const physicsBody = new PhysicsBody(mergedMesh, PhysicsMotionType.STATIC, false, Game.scene);
            const physicsShape = new PhysicsShape({
                type: PhysicsShapeType.MESH,
                parameters: {
                    mesh: mergedMesh,
                }
            }, Game.scene);
            physicsBody.shape = physicsShape;

            physicsBody.disablePreStep = false;
            Game.scene.onBeforeRenderObservable.addOnce(() => physicsBody.disablePreStep = true);
        }




        const stele = new Stele();
        const steleInteractionZone = stele.steleInteractionZone;
        steleInteractionZone.zone.parent = templeTransform;
        steleInteractionZone.zone.position = new Vector3(0,0,50);

        const templePuzzle = new TemplePuzzle(templeTransform, new Vector3(0,0,0));

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

    public static async createBanquise(){
        const banquiseTransform: TransformNode = new TransformNode("temple transform");
        const banquise = new KeyZone();

        banquise.name = "Banquise";
        banquise.detectionZone = new SphericalDetectionZone({
            diameter : 500,
        }, true);

        const result = await Utils.loadMesh("models/scenes/banquise.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = banquiseTransform;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            mesh.material = new CellMaterial("banquiseMat");
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = banquiseTransform;
            banquise.mesh = mergedMesh;
            banquiseTransform.position = new Vector3(100,0,100);
            banquiseTransform.rotate(Vector3.Up(), Angle.FromDegrees(180).radians(), Space.WORLD);

            const physicsBody = new PhysicsBody(mergedMesh, PhysicsMotionType.STATIC, false, Game.scene);
            const physicsShape = new PhysicsShape({
                type: PhysicsShapeType.MESH,
                parameters: {
                    mesh: mergedMesh,
                }
            }, Game.scene);
            physicsBody.shape = physicsShape;

            physicsBody.disablePreStep = false;
            Game.scene.onBeforeRenderObservable.addOnce(() => physicsBody.disablePreStep = true);
        }


    }

}