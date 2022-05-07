import { Zeiten } from 'Models/Zeiten';
import { Tag }    from './Tag';

export interface Zusammenfassung {
    zeitGesamt : Zeiten;
    zeitFeierOderWE : Zeiten;
    zeitUrlaub : Zeiten;
    zeitZuArbeiten : Zeiten;
    zeitRemote : Zeiten;
    zeitVorOrtGeplant : Zeiten;
    zeitVorOrtRest : Zeiten;
    zeitExternGeplant : Zeiten;
    zeitExternRest : Zeiten;
    
    tage : Tag[];
    
    letzterTagRZ? : string;
    letzterTagSZ? : string;
}
