import { TerminTyp } from 'Models/Enum/TerminTyp';

export interface TerminTagweise {
    dateString : string;
    typ : TerminTyp;
    stunden? : number;
}
