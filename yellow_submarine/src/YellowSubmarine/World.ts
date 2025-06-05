import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {KeyZoneFactory} from "@/YellowSubmarine/keyzone system/KeyZoneFactory";
import {GlowLayer} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {WorldInteractionManager} from "@/YellowSubmarine/world interaction system/interaction/WorldInteractionManager";
export class World {

    private static _instance: World;
    public static get instance(): World {
        return this._instance;
    }

    private _worldInteractionManager: InteractionManager<WorldInteraction>;
    private _sea: Sea;
    private _submarine: Submarine;
    private _sky: Sky;

    get worldInteractionManager(): WorldInteractionManager {
        return this._worldInteractionManager;
    }

    get submarine(): Submarine {
        return this._submarine;
    }

    constructor() {
        World._instance = this;
        this._worldInteractionManager = new WorldInteractionManager();
        this._sea = new Sea();
        this._submarine = new Submarine();
        this._sky = new Sky();
        const glowLayer = new GlowLayer("", Game.scene);
        glowLayer.intensity = 0.3;
    }

    public async init(): Promise<void> {

        await Promise.all([
            KeyZoneFactory.createDolphinIsland(),
            KeyZoneFactory.createTemple(),
            KeyZoneFactory.createBanquise(),
            KeyZoneFactory.createPhare(),
            KeyZoneFactory.createPoulpe(),
            KeyZoneFactory.createArchipel()
        ]);
    }


}