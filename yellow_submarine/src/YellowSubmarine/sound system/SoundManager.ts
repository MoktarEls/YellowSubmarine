import {
    AbstractMesh,
    CreateAudioEngineAsync,
    CreateSoundAsync, ISoundOptions, SoundState,
    StaticSound
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
export class SoundManager {

    public static instance: SoundManager;
    private _audioEngine;
    private _SFXsounds = new Map<string, StaticSound>();
    private _UIsounds = new Map<string, StaticSound>();
    private _MUSICsounds = new Map<string, StaticSound>();

    private _SFXVolume : number;
    private _UIVolume : number;
    private _MUSICVolume : number;


    constructor() {
        SoundManager.instance = this;
        this._SFXVolume = 0.8;
        this._UIVolume = 1;
        this._MUSICVolume = 0;
        Game.scene.headphone = true;
        this._audioEngine = CreateAudioEngineAsync();
        this._audioEngine.then((engine) => {
            engine.unlockAsync();
            Game.scene.onBeforeRenderObservable.add(() => {
                if(Game.scene.activeCamera !== null) {
                    engine.listener.position = Game.scene.activeCamera?.position;
                }
            });
        });
        Game.scene.onReadyObservable.add(() => {
            this.playSFX("wind", {
                loop: true,
                autoplay: true,
            });
        })
        Game.scene.onReadyObservable.add(() => {
            this.playMUSIC("ambiant", {
                loop: true,
                autoplay: true,
            });
        })
    }

    private async load(name: string, url: string, options?: Partial<ISoundOptions>) {
        return CreateSoundAsync(name, `${url}/${name}.wav`, options);
    }

    protected async play(name: string, url: string, map: Map<string, StaticSound>, volume: number, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        const sound = map.get(name);
        if(sound) {
            if(sound.state !== SoundState.Started) {
                this.fadeIn(sound, volume, 100);
                sound.play();
            }
        }
        else{
            const sound = await this.load(name, url, options);
            map.set(name, sound)
            if (options?.spatialSound && mesh) {
                sound.spatial.attach(mesh);
                sound.spatial.maxDistance = options.maxDistance ?? 100;
                sound.spatial.distanceModel = "linear";
                console.log(sound.spatial);
            }
            this.fadeIn(sound, volume, 1000);
            sound.play();
        }
    }

    public async playSFX(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/sfx", this._SFXsounds, this.SFXVolume, options, mesh);
    }

    public async playUI(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/ui", this._UIsounds, this.UIVolume, options, mesh);
    }

    public async playMUSIC(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/music", this._MUSICsounds, this.MUSICVolume, options, mesh);
    }

    private fadeIn(sound: StaticSound, targetVolume: number, duration: number) {
        sound.volume = 0;
        const stepTime = 20;
        const steps = duration / stepTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const volume = targetVolume * (currentStep / steps);
            sound.volume = Math.min(volume, targetVolume);
            if (currentStep >= steps) clearInterval(interval);
        }, stepTime);
    }

    private fadeOutAndStop(sound: StaticSound, duration: number) {
        const stepTime = 20;
        const steps = duration / stepTime;
        let currentStep = 0;
        const initialVolume = sound.volume;

        const interval = setInterval(() => {
            currentStep++;
            const volume = initialVolume * (1 - currentStep / steps);
            sound.volume = Math.max(volume, 0);
            if (currentStep >= steps) {
                clearInterval(interval);
                sound.stop();
            }
        }, stepTime);
    }

    public stopSFX(name: string) {
        const sound = this._SFXsounds.get(name);
        if (sound) this.fadeOutAndStop(sound, 100);
    }

    public stopUI(name: string) {
        const sound = this._UIsounds.get(name);
        if (sound) this.fadeOutAndStop(sound, 100);
    }

    public stopMUSIC(name: string) {
        const sound = this._MUSICsounds.get(name);
        if (sound) this.fadeOutAndStop(sound, 100);
    }

    public stopAll(map : Map<string, StaticSound>) {
        map.forEach(sound => {sound.stop()});
    }

    public get SFXVolume(): number {
        return this._SFXVolume;
    }

    public set SFXVolume(value: number) {
        this._SFXVolume = value;
        this._SFXsounds.forEach((sound) => {
            sound.volume = this._SFXVolume;
        })
    }

    public get UIVolume(): number {
        return this._UIVolume;
    }

    public set UIVolume(value: number) {
        this._UIVolume = value;
        this._UIsounds.forEach((sound) => {
            sound.volume = this._UIVolume;
        })
    }

    public get MUSICVolume(): number {
        return this._MUSICVolume;
    }

    public set MUSICVolume(value: number) {
        this._MUSICVolume = value;
        this._MUSICsounds.forEach((sound) => {
            sound.volume = this._MUSICVolume;
        })
    }
}