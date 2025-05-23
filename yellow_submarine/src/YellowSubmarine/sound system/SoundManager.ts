import {
    AbstractMesh,
    CreateAudioEngineAsync,
    CreateSoundAsync, ISoundOptions,
    StaticSound
} from "@babylonjs/core";
import {name} from "@babylonjs/gui";
import * as url from "node:url";
import * as url from "node:url";

export class SoundManager {

    public static instance: SoundManager;
    private _audioEngine = CreateAudioEngineAsync();
    private _SFXsounds = new Map<string, StaticSound>();
    private _UIsounds = new Map<string, StaticSound>();
    private _MUSICsounds = new Map<string, StaticSound>();
    private _SFXVolume : number;
    private _UIVolume : number;
    private _MUSICVolume : number;

    constructor() {
        SoundManager.instance = this;
        this._SFXVolume = 1;
        this._UIVolume = 1;
        this._MUSICVolume = 1;
    }

    private async load(name: string, url: string, options?: Partial<ISoundOptions>) {
        await (await this._audioEngine).unlockAsync();
        return CreateSoundAsync(name, `${url}/${name}.wav`, options);
    }

    private async play(name: string, url: string, map: Map<string, StaticSound>, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        const sound = map.get(name);
        if(sound) {
            if(options?.spatialSound && mesh) sound.spatial.attach(mesh)
            this.fadeIn(sound, options?.volume ?? 1, 50);
            sound.play();
        }
        else{
            await this.load(name, url, options).then((sound) => {
                map.set(name, sound)
                if(options?.spatialSound && mesh) sound.spatial.attach(mesh)
                this.fadeIn(sound, options?.volume ?? 1, 50);
                sound.play();
            });
        }
    }

    public async playSFX(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/sfx", this._SFXsounds, options, mesh);
    }

    public async playUI(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/ui", this._UIsounds, options, mesh);
    }

    public async playMUSIC(name: string, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        await this.play(name, "sounds/music", this._MUSICsounds, options, mesh);
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
        if (sound) this.fadeOutAndStop(sound, 50);
    }

    public stopUI(name: string) {
        const sound = this._UIsounds.get(name);
        if (sound) this.fadeOutAndStop(sound, 50);
    }

    public stopMUSIC(name: string) {
        const sound = this._MUSICsounds.get(name);
        if (sound) this.fadeOutAndStop(sound, 50);
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