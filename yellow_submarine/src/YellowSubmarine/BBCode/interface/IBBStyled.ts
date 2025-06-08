import {BBStyle} from "@/YellowSubmarine/BBCode/BBStyle";

export interface IBBStyled {

    getStyle(): BBStyle;
    getText(): string;

}