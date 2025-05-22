import {
    AbstractMesh,
    CreateAudioEngineAsync,
    CreateSoundAsync, ISoundOptions,
    StaticSound
} from "@babylonjs/core";

export class SoundManager {

    public static instance: SoundManager;
    private _audioEngine = CreateAudioEngineAsync();
    private _SFXsounds = new Map<string, StaticSound>();
    private _UIsounds = new Map<string, StaticSound>();
    private _MUSICsounds = new Map<string, StaticSound>();



    constructor() {
        SoundManager.instance = this;
    }

    private async load(name: string, url: string, options?: Partial<ISoundOptions>) {
        await (await this._audioEngine).unlockAsync();
        return CreateSoundAsync(name, `${url}/${name}.wav`, options);
    }

    private async play(name: string, url: string, map: Map<string, StaticSound>, options?: Partial<ISoundOptions>, mesh?: AbstractMesh) {
        const sound = map.get(name);
        if(sound) {
            if(options?.spatialSound && mesh) sound.spatial.attach(mesh)
            sound.play();
        }
        else{
            await this.load(name, url, options).then((sound) => {
                map.set(name, sound)
                if(options?.spatialSound && mesh) sound.spatial.attach(mesh)
                sound.volume = 0.2;
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

    public stopSFX(name: string) {
        this._SFXsounds.get(name)?.stop();
    }

    public stopUI(name: string) {
        this._UIsounds.get(name)?.stop();
    }

    public stopMUSIC(name: string) {
        this._MUSICsounds.get(name)?.stop();
    }
}