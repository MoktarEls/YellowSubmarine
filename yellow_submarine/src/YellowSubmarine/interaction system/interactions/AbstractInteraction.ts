import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractInteraction {

    public get key(): string {
        return this._key;
    }

    constructor(private _key: string) {}

    public makeAvailable(){
        InteractionManager.instance.addAvailableInteraction(this);
    }

    public makeUnavailable(){
        InteractionManager.instance.removeAvailableInteraction();
    }

    public abstract executeInteraction(): void;

}