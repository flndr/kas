import { KeinRemoteTyp } from 'Models/Enum/KeinRemoteTyp';

export interface KeinRemote {
    dateString : string;
    typ : KeinRemoteTyp;
    ganzerTag : boolean;
    stundenAbwesend? : number;
}
