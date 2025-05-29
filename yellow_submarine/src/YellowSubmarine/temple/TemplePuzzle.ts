import {Angle, Color3, Observable, TransformNode, Vector3} from "@babylonjs/core";
import {Socle} from "@/YellowSubmarine/temple/Socle";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {SphericalDetectionZone} from "@/YellowSubmarine/detection system/SphericalDetectionZone";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Player} from "@/YellowSubmarine/Player";

export class TemplePuzzle {
    private _upperRightSocle: Socle;
    private _middleRightSocle: Socle;
    private _lowerRightSocle: Socle;
    private _lowerMiddleSocle: Socle;
    private _lowerLeftSocle: Socle;
    private _middleLeftSocle: Socle;
    private _upperLeftSocle: Socle;
    private _upperMiddleSocle: Socle;
    private _centerSocle: Socle;

    public static get instance(): TemplePuzzle{
        return this._instance;
    }

    public get transformNode(): TransformNode {
        return this._transformNode;
    }

    public onPuzzleResolved = new Observable<void>();
    public onPuzzleRejected = new Observable<void>();

    private static _instance: TemplePuzzle;

    private static _ball: TempleBall[] = new Array<TempleBall>();

    public static registerBall(ball: TempleBall): void {
        this._ball.push(ball);
        ball.onPlacedOnSocle.add(() => {
            this._instance.onBallPlacedOnSocle();
        });
    }

    private _transformNode: TransformNode = new TransformNode("templePuzzle");
    private _cameraConfiguration: CameraConfiguration;
    private _detectionZone: MeshDetectionZone;

    public constructor(parent: TransformNode, position: Vector3) {
        TemplePuzzle._instance = this;
        this._transformNode.parent = parent;
        this._transformNode.rotation = Vector3.Zero();
        this._transformNode.position = position;
        this._detectionZone = new SphericalDetectionZone({
            diameter: 70,
        }, false);
        this._detectionZone.zone.parent = this._transformNode;
        this._cameraConfiguration = new CameraConfiguration();
        this._cameraConfiguration.target = this._transformNode;
        this._cameraConfiguration.wantedBeta = Angle.FromDegrees(0).radians();
        this._cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();
        this._cameraConfiguration.distanceFromTarget = 100;
        this._detectionZone.onMeshEnter.add(() => {
            ConfigurableCamera.instance.cameraConfiguration = this._cameraConfiguration;
        });
        this._detectionZone.onMeshExit.add(() => {
            ConfigurableCamera.instance.cameraConfiguration = Player.playerCameraConfiguration;
        })
        Submarine.instance.meshCreationPromise.then((mesh) => {
            this._detectionZone.addMeshToDetect(mesh);
        })
        this._upperRightSocle = this.createSocle(new Vector3(-1,0,-1).scale(20));
        this._middleRightSocle = this.createSocle(new Vector3(-1,0,0).scale(20), Color3.Purple());
        this._lowerRightSocle = this.createSocle(new Vector3(-1,0,1).scale(20), Color3.Blue());
        this._lowerMiddleSocle = this.createSocle(new Vector3(0,0,1).scale(20), Color3.Green());
        this._lowerLeftSocle = this.createSocle(new Vector3(1,0,1).scale(20), Color3.Red());
        this._middleLeftSocle = this.createSocle(new Vector3(1,0,0).scale(20));
        this._upperLeftSocle = this.createSocle(new Vector3(1,0,-1).scale(20), Color3.Gray());
        this._upperMiddleSocle = this.createSocle(new Vector3(0,0,-1).scale(20), Color3.Yellow());
        this._centerSocle = this.createSocle(Vector3.Zero());

        // TODO: Test only, remove after
        const greenBall = new TempleBall(new Vector3(40,0,10), Color3.Green());
        const grayBall = new TempleBall(new Vector3(40,0,20), Color3.Gray());
        const yellowBall = new TempleBall(new Vector3(50,0,20), Color3.Yellow());
/*        this._lowerLeftSocle.meshImportedPromise.then(() => {
            this._lowerLeftSocle.placeBall(redBall);
        });
        this._lowerMiddleSocle.meshImportedPromise.then(() => {
            this._lowerMiddleSocle.placeBall(greenBall);
        });
        this._lowerRightSocle.meshImportedPromise.then(() => {
            this._lowerRightSocle.placeBall(blueBall);
        });
        this._middleRightSocle.meshImportedPromise.then(() => {
            this._middleRightSocle.placeBall(purpleBall);
        });
        this._upperLeftSocle.meshImportedPromise.then(() => {
            this._upperLeftSocle.placeBall(grayBall);
        });
        this._upperMiddleSocle.meshImportedPromise.then(() => {
            this._upperMiddleSocle.placeBall(yellowBall);
        });*/
    }

    private createSocle(position: Vector3, validColor?: Color3){
        const socle = new Socle(this._transformNode, position);
        socle.validColor = validColor;
        return socle;
    }

    private onBallPlacedOnSocle(){
        if(this.isAllBallPlacedOnASocle()){
            if(this.checkConfiguration()){
                this.onPuzzleResolved.notifyObservers();
            }
            else{
                this.onPuzzleRejected.notifyObservers();
            }

        }
    }

    private isAllBallPlacedOnASocle(){
        let numberOfPlaced = 0;
        TemplePuzzle._ball.forEach( (ball) => {
            if(ball.socle){
                numberOfPlaced++;
            }
        });
        return numberOfPlaced == 6;
    }

    private checkConfiguration() {
        for(let i = 0; i < TemplePuzzle._ball.length; i++) {
            const ball = TemplePuzzle._ball[i];
            const socle = ball.socle;
            if (socle) {
                const socleValidColor = socle.validColor;
                if (socleValidColor === undefined || !ball.color.equals(socleValidColor) ) {
                    return false;
                }
            } else {
                console.log("Some ball are not placed");
                return false;
            }
        }
        return true;
    }

}