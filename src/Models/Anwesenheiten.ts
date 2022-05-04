export interface Abwesenheit {
    dateString : string;
    zeitAbwesend : number;
}

export interface Zusammenfassung {
    gesamt : number;
    davonArbeitstage : number;
    davonFeierOderWE : number;
    davonAbwesenheit : number;
}

export type Abwesenheiten = Abwesenheit[];

export interface Abwesenheit {
    dateString : string;
    ganzerTag : boolean;
    zeitAbwesend : number;
}

export interface Tag {
    dateString : string;
    istFeiertagOderWE : boolean;
    zeitZuArbeiten : number;
    zeitAbzglAbwesenheit : number;
}
