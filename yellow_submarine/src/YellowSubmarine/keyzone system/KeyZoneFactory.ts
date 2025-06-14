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
    Space, StandardMaterial,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import {Utils} from "@/YellowSubmarine/Utils";
import {NPCFactory} from "@/YellowSubmarine/npcs/NPCFactory";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {Game} from "@/YellowSubmarine/Game";
import {Stele} from "@/YellowSubmarine/temple/Stele";
import {TemplePuzzle} from "@/YellowSubmarine/temple/TemplePuzzle";
import {CellMaterial} from "@babylonjs/materials";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class KeyZoneFactory {

    private static readonly _dolphinPosition: Vector3 = new Vector3(0,0,160);
    private static readonly _templePosition: Vector3 = new Vector3(0, 0, 500);
    private static readonly _banquisePosition: Vector3 = new Vector3(-200, -0.8, 680);
    private static readonly _archipelPosition: Vector3 = new Vector3(200, 0, 680);
    private static readonly _pharePosition: Vector3 = new Vector3(-250, 0, 420);
    private static readonly _poulpePosition: Vector3 = new Vector3(250, 0, 420);

    public static async createDolphinIsland(): Promise<KeyZone> {
        const _transformIsland: TransformNode = new TransformNode("island transform");
        const island = new KeyZone();

        island.name = "Dolphin island";
        island.detectionZone = new SphericalDetectionZone({
            diameter : 200
        }, true);

        const result = await Utils.loadMesh("models/scenes/dolphinIsland.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = _transformIsland;
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
            mergedMesh.parent = _transformIsland;
            island.mesh = mergedMesh;
            _transformIsland.position = this._dolphinPosition;

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


            NPCFactory.createPedro().then( (pedro) => {
                pedro.transformNode.position = new Vector3(-30, 15, -14);
                pedro.transformNode.parent = _transformIsland;

                island.addConversationProvider(pedro);
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
            diameter : 260,
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
            templeTransform.position = this._templePosition;
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

        temple.addConversationProvider(stele);

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
        const banquiseTransform: TransformNode = new TransformNode("banquise transform");
        const banquise = new KeyZone();

        banquise.name = "Fractisberg";
        banquise.detectionZone = new SphericalDetectionZone({
            diameter : 200,
        }, true);

        const result = await Utils.loadMesh("models/scenes/banquise.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = banquiseTransform;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const pbrMaterial = mesh.material as PBRMaterial;
            const standardMat = mesh.material as StandardMaterial;
            if(pbrMaterial){
                const cellMaterial = new CellMaterial("banquiseMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = pbrMaterial.albedoColor;
                if(pbrMaterial.albedoTexture){
                    cellMaterial.diffuseTexture = pbrMaterial.albedoTexture;
                }
                mesh.material = cellMaterial;
                cellMaterial.cullBackFaces = false;

            }
            else if(standardMat){
                const cellMaterial = new CellMaterial("banquiseMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = standardMat.diffuseColor;
                if(standardMat.diffuseTexture){
                    cellMaterial.diffuseTexture = standardMat.diffuseTexture;
                }
                mesh.material = cellMaterial;
                cellMaterial.cullBackFaces = false;
            }

        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = banquiseTransform;
            banquise.mesh = mergedMesh;
            banquiseTransform.position = this._banquisePosition;
            banquiseTransform.rotate(Vector3.Up(), Angle.FromDegrees(-90).radians(), Space.WORLD);

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

            NPCFactory.createFox().then( (fox) => {
                fox.transformNode.position = new Vector3(-8, 1.4, 0);
                fox.transformNode.parent = banquiseTransform;
                const ball = new TempleBall(fox.transformNode.absolutePosition.add(new Vector3(0,20,0)), Color3.Green());
                const callBack = fox.dialogue?.onDialogueEndedObservable.add(() => {
                    if(!Submarine.instance.templeBall){
                        Submarine.instance.grabBall(ball);
                        fox.dialogue?.onDialogueEndedObservable.remove(callBack ?? null);
                    }
                });
                banquise.addConversationProvider(fox);
            });
        }


    }

    public static async createArchipel(){
        const archipelTransform: TransformNode = new TransformNode("archipel transform");
        const archipel = new KeyZone();

        archipel.name = "L'Archipel Carotte";
        archipel.detectionZone = new SphericalDetectionZone({
            diameter : 200,
        }, true);

        const result = await Utils.loadMesh("models/scenes/archipel.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = archipelTransform;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const pbrMaterial = mesh.material as PBRMaterial;
            const standardMat = mesh.material as StandardMaterial;
            if(pbrMaterial){
                const cellMaterial = new CellMaterial("archipelMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = pbrMaterial.albedoColor;
                if(pbrMaterial.albedoTexture){
                    cellMaterial.diffuseTexture = pbrMaterial.albedoTexture;
                }
                mesh.material = cellMaterial;
            }
            else if(standardMat){
                const cellMaterial = new CellMaterial("archipelMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = standardMat.diffuseColor;
                if(standardMat.diffuseTexture){
                    cellMaterial.diffuseTexture = standardMat.diffuseTexture;
                }
                mesh.material = cellMaterial;
            }
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = archipelTransform;
            archipel.mesh = mergedMesh;
            archipelTransform.position = this._archipelPosition;
            archipelTransform.rotate(Vector3.Up(), Angle.FromDegrees(-90).radians(), Space.WORLD);

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

            NPCFactory.createRabbit().then( (rabbit) => {
                rabbit.transformNode.position = new Vector3(-0.8, 5.2, -0.7);
                rabbit.transformNode.parent = archipelTransform;
                const ball = new TempleBall(rabbit.transformNode.absolutePosition.add(new Vector3(0,20,0)), Color3.Red());
                const callBack = rabbit.dialogue?.onDialogueEndedObservable.add(() => {
                    if(!Submarine.instance.templeBall){
                        Submarine.instance.grabBall(ball);
                        rabbit.dialogue?.onDialogueEndedObservable.remove(callBack ?? null);
                    }
                });
                archipel.addConversationProvider(rabbit);
            });


        }


    }

    public static async createPoulpe(){
        const poulpeTransform: TransformNode = new TransformNode("poulpe transform");
        const poulpe = new KeyZone();

        poulpe.name = "Le Poulpensant";
        poulpe.detectionZone = new SphericalDetectionZone({
            diameter : 200,
        }, true);

        const result = await Utils.loadMesh("models/scenes/poulpe.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = poulpeTransform;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const pbrMaterial = mesh.material as PBRMaterial;
            const standardMat = mesh.material as StandardMaterial;
            if(pbrMaterial){
                const cellMaterial = new CellMaterial("poulpeMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = pbrMaterial.albedoColor;
                if(pbrMaterial.albedoTexture){
                    cellMaterial.diffuseTexture = pbrMaterial.albedoTexture;
                }
                mesh.material = cellMaterial;
            }
            else if(standardMat){
                const cellMaterial = new CellMaterial("poulpeMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = standardMat.diffuseColor;
                if(standardMat.diffuseTexture){
                    cellMaterial.diffuseTexture = standardMat.diffuseTexture;
                }
                mesh.material = cellMaterial;
            }

        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = poulpeTransform;
            poulpe.mesh = mergedMesh;
            poulpeTransform.position = this._poulpePosition;

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

            NPCFactory.createScribe().then( (scribe) => {
                scribe.transformNode.position = new Vector3(-1.57, 0.8, 5.8);
                scribe.transformNode.parent = poulpeTransform;
                const ball = new TempleBall(scribe.transformNode.absolutePosition.add(new Vector3(0,20,0)), Color3.Purple());
                const callBack = scribe.dialogue?.onDialogueEndedObservable.add(() => {
                    if(!Submarine.instance.templeBall){
                        Submarine.instance.grabBall(ball);
                        scribe.dialogue?.onDialogueEndedObservable.remove(callBack ?? null);
                    }
                });
                poulpe.addConversationProvider(scribe);
            });
        }


    }

    public static async createPhare(){
        const phareTransform: TransformNode = new TransformNode("phare transform");
        const phare = new KeyZone();

        phare.name = "Le Phare Flashouille";
        phare.detectionZone = new SphericalDetectionZone({
            diameter : 200,
        }, true);

        const result = await Utils.loadMesh("models/scenes/phare.glb");
        const rootMesh = result.meshes[0];
        rootMesh.position = Vector3.Zero();
        rootMesh.parent = phareTransform;
        const childMeshes = rootMesh.getChildMeshes<Mesh>();
        for (const mesh of result.meshes) {
            const pbrMaterial = mesh.material as PBRMaterial;
            const standardMat = mesh.material as StandardMaterial;
            if(pbrMaterial){
                const cellMaterial = new CellMaterial("phareMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = pbrMaterial.albedoColor;
                if(pbrMaterial.albedoTexture){
                    cellMaterial.diffuseTexture = pbrMaterial.albedoTexture;
                }
                mesh.material = cellMaterial;
            }
            else if(standardMat){
                const cellMaterial = new CellMaterial("phareMat");
                cellMaterial.needDepthPrePass = true;
                cellMaterial.diffuseColor = standardMat.diffuseColor;
                if(standardMat.diffuseTexture){
                    cellMaterial.diffuseTexture = standardMat.diffuseTexture;
                }
                mesh.material = cellMaterial;
            }
        }
        const mergedMesh = Mesh.MergeMeshes(childMeshes,true, undefined, undefined, undefined, true);
        if(mergedMesh){
            mergedMesh.parent = phareTransform;
            phare.mesh = mergedMesh;
            phareTransform.position = this._pharePosition;
            //phareTransform.rotate(Vector3.Up(), Angle.FromDegrees(180).radians(), Space.WORLD);

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

            NPCFactory.createGirl().then( (girl) => {
                girl.transformNode.position = new Vector3(1.2, 1.26, -16.90);
                girl.transformNode.parent = phareTransform;
                const ball = new TempleBall(girl.transformNode.absolutePosition.add(new Vector3(-30,20,-30)), Color3.Blue());
                const callBack = girl.dialogue?.onDialogueEndedObservable.add(() => {
                    if(!Submarine.instance.templeBall){
                        Submarine.instance.grabBall(ball);
                        girl.dialogue?.onDialogueEndedObservable.remove(callBack ?? null);
                    }
                });
                phare.addConversationProvider(girl);
            });
        }


    }

}