import { Injectable } from "@angular/core";
import { DIRECTIVAS } from "./directiva.json";

@Injectable()
export class DirectivaService{

    constructor(){}

    getDirectivas():string[] {
        return DIRECTIVAS;
    }
}