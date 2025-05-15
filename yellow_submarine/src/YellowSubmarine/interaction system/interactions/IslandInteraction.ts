import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";

export class IslandInteraction extends AbstractInteraction{

    private _name:string;

    constructor(name: string) {
        super("");
        this._name = name;
    }

    public get name():string{
        return this._name;
    }

    executeInteraction(): void {
        return;
    }

}