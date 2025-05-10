import {Moon} from "@/YellowSubmarine/sky system/Moon";
import {Sky} from "@/YellowSubmarine/sky system/Sky";
import {Sun} from "@/YellowSubmarine/sky system/Sun";

export class DayNightCycle {
    
    private _sun : Sun;
    private _moon : Moon;
    
    constructor(sky : Sky) {
        this._sun = sky.sun;
        this._moon = sky.moon;
    }
    
}