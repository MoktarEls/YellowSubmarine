import {World} from "@/YellowSubmarine/World";
import {Color3, DirectionalLight, Engine, HavokPlugin, Observable, Scene, Vector3} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {HavokPhysicsWithBindings} from "@babylonjs/havok";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";

export class Game{

    private static _instance: Game;

    public static onGameFocusChange: Observable<boolean> = new Observable<boolean>();

    private _scene: Scene;
    private _engine: Engine;
    private _world: World;
    private _player: Player;
    private _isGameFocused = false;
    private _camera: ConfigurableCamera;
    private _interactionManager: InteractionManager;
    private _uiManager: UIManager;
    private _soundManager : SoundManager;

    public static get canvas(){
        return this._instance._canvas;
    }

    public static get engine(): Engine {
        return Game._instance._engine;
    }

    public static get scene(): Scene {
        return Game._instance._scene;
    }

    public static get uiManager(): UIManager {
        return Game._instance._uiManager;
    }

    public static get isGameFocused(): boolean {
        return Game._instance._isGameFocused;
    }

    constructor(private _canvas: HTMLCanvasElement, private _havok: HavokPlugin) {
        Game._instance = this;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._scene.enablePhysics(new Vector3(0,0,0), _havok);
        this._interactionManager = new InteractionManager();
        this._camera = new ConfigurableCamera();
        this._world = new World();
        this._player = new Player();
        this._soundManager = new SoundManager();
        this._uiManager = new UIManager(_canvas);

        document.addEventListener("pointerlockchange", () => {
            this.updateFocusState(document.pointerLockElement === _canvas);
        });

        this._engine.runRenderLoop(() => {
            this._scene.render();
        })
        window.addEventListener("resize", () => this._engine.resize() );
    }

    private updateFocusState(state: boolean) {
        if(state != this._isGameFocused){
            this._isGameFocused = state;
            Game.onGameFocusChange.notifyObservers(this._isGameFocused);
            if (!this._isGameFocused) {
                Game.uiManager.showMainMenu();
            }
        }
    }



}