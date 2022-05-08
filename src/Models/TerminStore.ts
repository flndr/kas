import { TerminTyp } from 'Models/Enum/TerminTyp';

export interface TerminStore {
    dateStringStart : string;
    dateStringEnde? : string;
    typ : TerminTyp;
    stunden? : number;
    repeat? : true;
}
