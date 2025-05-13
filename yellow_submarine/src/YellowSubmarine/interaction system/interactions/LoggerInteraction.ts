import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";

export class LoggerInteraction extends AbstractInteraction {

    constructor(private _msg: string) {
        super("KeyL");
    }

    executeInteraction(): void {
        console.log(this._msg);
    }

}