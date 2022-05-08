export interface Tag {
    date : Date;
    dateString : string;
    istLetzterTagRZ : boolean;
    istLetzterTagSZ : boolean;
    istArbeitstag : boolean;
    istFeiertagOderWE : boolean;
    istUrlaubstag : boolean;
    istExternGanztaegig : boolean;
    stundenZuArbeiten : number;
    stundenGearbeitet : number;
    stundenUrlaub : number;
    stundenRemote : number;
    stundenExternGeplant : number;
    stundenExternRest : number;
    stundenVorOrtGeplant : number;
    stundenVorOrtRest : number;
}
