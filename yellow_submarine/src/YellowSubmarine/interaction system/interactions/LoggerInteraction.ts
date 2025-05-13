import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";

export class LoggerInteraction extends AbstractInteraction {

    constructor(private _msg: string) {
        super("l");
    }

    executeInteraction(): void {
        console.log(this._msg);
    }

}