import { KeinRemote } from 'Models/KeinRemote';

export interface Tag {
    dateString : string;
    keinRemote? : KeinRemote
    istArbeitstag : boolean;
    stundenZuArbeiten : number;
    stundenGearbeitet : number;
}
