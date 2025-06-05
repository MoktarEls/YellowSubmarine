import {Sea} from "@/YellowSubmarine/Sea";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {KeyZoneFactory} from "@/YellowSubmarine/keyzone system/KeyZoneFactory";
import {GlowLayer} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
export class World {

    private static _instance: World;
    public static get instance(): World {
        return this._instance;
    }

    private _worldInteractionManager: InteractionManager<WorldInteraction>;
    private _sea: Sea;
    private _submarine: Submarine;
    private _sky: Sky;

    get worldInteractionManager(): InteractionManager<WorldInteraction> {
        return this._worldInteractionManager;
    }

    constructor() {
        World._instance = this;
        this._worldInteractionManager = new InteractionManager<WorldInteraction>();
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