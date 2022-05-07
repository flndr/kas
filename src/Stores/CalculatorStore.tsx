import { startOfMonth }       from 'date-fns';
import { startOfWeek }        from 'date-fns';
import { isBefore }           from 'date-fns';
import { isSaturday }         from 'date-fns';
import { getYear }            from 'date-fns';
import { parse }              from 'date-fns';
import { format }             from 'date-fns';
import { isSunOrHoliday }     from 'feiertagejs';
import { getHolidays }        from 'feiertagejs';
import { Region }             from 'feiertagejs';
import { Holiday }            from 'feiertagejs';
import { makeAutoObservable } from 'mobx';
import { stopPersisting }     from 'mobx-persist-store';
import { makePersistable }    from 'mobx-persist-store';

import { Arbeitszeit }     from 'Models/Arbeitszeit';
import { KeinRemoteTyp }   from 'Models/Enum/KeinRemoteTyp';
import { Wochentag }       from 'Models/Enum/Wochentag';
import { KeinRemote }      from 'Models/KeinRemote';
import { Tag }             from 'Models/Tag';
import { Zeiten }          from 'Models/Zeiten';
import { Zusammenfassung } from 'Models/Zusammenfassung';
import React               from 'react';
import { FC }              from 'react';
import { useContext }      from 'react';
import { createContext }   from 'react';

export class CalculatorStore {
    
    static readonly dateFormat : string = 'yyyy-MM-dd';
    
    readonly today : string;
    readonly region : Region = 'BY';
    readonly holidays : Holiday[];
    
    _arbeitszeiten : Arbeitszeit = {
        [ Wochentag.Montag ]     : 9.25,
        [ Wochentag.Dienstag ]   : 9.25,
        [ Wochentag.Mittwoch ]   : 6,
        [ Wochentag.Donnerstag ] : 9.25,
        [ Wochentag.Freitag ]    : 7.5,
    }
    
    _keinRemote : KeinRemote[] = [];
    _reststundenRZ : number    = 580;
    _reststundenSZ : number    = 300;
    _letzterTagAbruf : string  = '2022-10-31';
    
    constructor() {
        makeAutoObservable( this );
        
        //makePersistable( this, {
        //    name       : 'CalculatorStore',
        //    storage    : window.localStorage,
        //    properties : [
        //        '_arbeitszeiten',
        //        '_keinRemote',
        //        '_letzterTagAbruf',
        //        '_reststunden',
        //    ]
        //} );
        
        const currentDate = CalculatorStore.stringToDate( '2022-05-01' ); // TODO make input on UI
        const currentYear = getYear( currentDate );
        this.today        = CalculatorStore.dateToString( currentDate );
        this.holidays     = [
            ...getHolidays( currentYear - 1, this.region ),
            ...getHolidays( currentYear + 0, this.region ),
            ...getHolidays( currentYear + 1, this.region ),
        ];
    }
    
    stopStore() {
        stopPersisting( this );
    }
    
    get keinRemote() : KeinRemote[] {
        return this._keinRemote;
    }
    
    get letzterTagAbruf() : Date {
        return CalculatorStore.stringToDate( this._letzterTagAbruf );
    }
    
    get durchschnittleicheArbeitszeitProWoche() : number {
        let zeit = 0;
        Object.values( this._arbeitszeiten ).forEach( z => zeit += z );
        return zeit;
    }
    
    get durchschnittleicheArbeitszeitProTag() : number {
        return this.durchschnittleicheArbeitszeitProWoche / 5;
    }
    
    private forEachDay( callback : ( date : Date, dateString : string ) => void ) {
        const start = CalculatorStore.stringToDate( this.today );
        
        for ( const d = start; d <= this.letzterTagAbruf; d.setDate( d.getDate() + 1 ) ) {
            callback( d, CalculatorStore.dateToString( d ) );
        }
    }
    
    get zeitBisAbrufEnde() : Zeiten {
        let stunden = 0;
        this.forEachDay( ( date : Date ) => {
            stunden += this.getStundenProTag( date );
        } );
        return {
            stunden,
            tage : stunden / this.durchschnittleicheArbeitszeitProTag
        };
    }
    
    get stundenGearbeitetBisAbrufEnde() {
        let stunden = 0;
        //this.tage.forEach( t => stunden += t.stundenGearbeitet )
        return stunden;
    }
    
    get stundenAbwesenheitBisAbrufEnde() {
        //return this.stundenBisAbrufEnde - this.stundenGearbeitetBisAbrufEnde;
        return 0
    }
    
    getArbeitszeit( w : Wochentag ) : number {
        return this._arbeitszeiten[ w ];
    }
    
    setArbeitszeit( w : Wochentag, value : number | string ) {
        let zeit;
        if ( typeof value === 'string' ) {
            zeit = parseFloat( value );
        } else {
            zeit = value;
        }
        
        this._arbeitszeiten = {
            ...this._arbeitszeiten,
            [ w ] : zeit
        }
    }
    
    static dateToString( date : Date ) : string {
        return format( date, CalculatorStore.dateFormat );
    }
    
    static stringToDate( date : string ) : Date {
        return parse( date, CalculatorStore.dateFormat, new Date() );
    }
    
    get reststundenRZ() : number {
        return this._reststundenRZ;
    }
    
    setReststundenRZ( value : string | number ) {
        if ( typeof value === 'string' ) {
            this._reststundenRZ = parseFloat( value );
        } else {
            this._reststundenRZ = value;
        }
    }
    
    setLetzterTagAbruf( date : Date | null ) {
        if ( date ) {
            this._letzterTagAbruf = CalculatorStore.dateToString( date );
        }
    }
    
    istFeiertagOderWE( date : Date ) : boolean {
        return isSaturday( date ) || isSunOrHoliday( date, this.region );
    }
    
    istUrlaubstag( dateString : string ) : boolean {
        if ( this.istFeiertagOderWE( CalculatorStore.stringToDate( dateString ) ) ) {
            return false;
        }
        return !!this._keinRemote.find( a => a.dateString === dateString );
    }
    
    getStundenAbwesend( dateString : string ) : number {
        const keinRemote = this._keinRemote.find( a => a.dateString === dateString );
        
        if ( !keinRemote ) {
            return 0;
        }
        
        if ( keinRemote.ganzerTag ) {
            return this.getStundenProTag( CalculatorStore.stringToDate( dateString ) );
        }
        
        return keinRemote.stundenAbwesend || 0;
    }
    
    getStundenProTag( date : Date ) : number {
        const wochentag = format( date, 'EEEE' );
        return this._arbeitszeiten[ wochentag as Wochentag ] || 0;
    }
    
    get monate() : string[] {
        const m : string[] = [];
        
        const start = CalculatorStore.stringToDate( this.today );
        
        for ( const d = start; d <= this.letzterTagAbruf; d.setDate( d.getDate() + 1 ) ) {
            const firstOfMonthString = CalculatorStore.dateToString( startOfMonth( d ) );
            if ( !m.includes( firstOfMonthString ) ) {
                m.push( firstOfMonthString );
            }
        }
        
        return m;
    }
    
    get zusammenfassung() : Zusammenfassung {
        
        const arbeitsZeitProTag = this.durchschnittleicheArbeitszeitProTag;
        
        const zusammenfassung : Zusammenfassung = {
            zeitGesamt        : { stunden : 0, tage : 0 },
            zeitFeierOderWE   : { stunden : 0, tage : 0 },
            zeitUrlaub        : { stunden : 0, tage : 0 },
            zeitZuArbeiten    : { stunden : 0, tage : 0 },
            zeitExternGeplant : { stunden : 0, tage : 0 },
            zeitExternRest    : { stunden : 0, tage : 0 },
            zeitRemote        : { stunden : 0, tage : 0 },
            zeitVorOrtGeplant : { stunden : 0, tage : 0 },
            zeitVorOrtRest    : { stunden : 0, tage : 0 },
            letzterTagRZ      : undefined,
            letzterTagSZ      : undefined,
            tage              : []
        };
        
        let stundenRzVoll = false;
        let stundenRz     = 0;
        let stundenSzVoll = false;
        let stundenSz     = 0;
        
        this.forEachDay( ( date : Date, dateString : string ) => {
            
            const istFeiertagOderWE       = this.istFeiertagOderWE( date );
            const istUrlaubstag           = this.istUrlaubstag( dateString );
            const istArbeitstag           = !( istUrlaubstag || istFeiertagOderWE );
            const stundenZuArbeitenCustom = this.getStundenProTag( date );
            
            zusammenfassung.zeitGesamt.stunden += arbeitsZeitProTag;
            
            if ( istFeiertagOderWE ) {
                zusammenfassung.zeitFeierOderWE.stunden += arbeitsZeitProTag;
            }
            
            if ( istUrlaubstag ) {
                zusammenfassung.zeitUrlaub.stunden += arbeitsZeitProTag;
            }
            
            const tag : Tag = {
                date,
                dateString,
                istArbeitstag,
                istFeiertagOderWE,
                istUrlaubstag,
                istLetzterTagRZ      : false,
                istLetzterTagSZ      : false,
                stundenExternGeplant : 0,
                stundenExternRest    : 0,
                stundenRemote        : 0,
                stundenVorOrtGeplant : 0,
                stundenVorOrtRest    : 0,
                stundenUrlaub        : istUrlaubstag ? arbeitsZeitProTag : 0,
                stundenZuArbeiten    : istArbeitstag ? arbeitsZeitProTag : 0,
                stundenGearbeitet    : istArbeitstag ? stundenZuArbeitenCustom : 0,
            };
            
            if ( istArbeitstag ) {
                
                zusammenfassung.zeitZuArbeiten.stunden += arbeitsZeitProTag
                
                tag.stundenUrlaub = 0;
                
                if ( stundenRzVoll && stundenSzVoll ) {
                    tag.stundenExternGeplant = tag.stundenGearbeitet;
                    zusammenfassung.zeitExternRest.stunden += tag.stundenGearbeitet;
                } else if ( stundenRzVoll ) {
                    stundenSz += tag.stundenGearbeitet;
                    tag.stundenVorOrtRest = tag.stundenGearbeitet;
                    zusammenfassung.zeitVorOrtRest.stunden += tag.stundenGearbeitet;
                } else {
                    stundenRz += tag.stundenGearbeitet;
                    tag.stundenRemote = tag.stundenGearbeitet;
                    zusammenfassung.zeitRemote.stunden += tag.stundenGearbeitet;
                }
                
                if ( !stundenRzVoll && !stundenSzVoll && this._reststundenRZ <= ( stundenRz + tag.stundenGearbeitet ) ) {
                    stundenRzVoll         = true;
                    tag.istLetzterTagRZ   = true;
                    tag.stundenRemote     = this._reststundenRZ - stundenRz;
                    tag.stundenVorOrtRest = tag.stundenGearbeitet - tag.stundenRemote;
                }
                
                if ( stundenRzVoll && !stundenSzVoll && this._reststundenSZ <= ( stundenSz + tag.stundenGearbeitet ) ) {
                    stundenSzVoll            = true;
                    tag.istLetzterTagSZ      = true;
                    tag.stundenVorOrtRest    = this._reststundenSZ - stundenSz;
                    tag.stundenExternGeplant = tag.stundenGearbeitet - tag.stundenVorOrtRest;
                }
                
            }
            zusammenfassung.tage.push( tag );
        } );
        
        zusammenfassung.zeitGesamt.tage        = zusammenfassung.zeitGesamt.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitFeierOderWE.tage   = zusammenfassung.zeitFeierOderWE.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitUrlaub.tage        = zusammenfassung.zeitUrlaub.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitZuArbeiten.tage    = zusammenfassung.zeitZuArbeiten.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitExternGeplant.tage = zusammenfassung.zeitExternGeplant.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitExternRest.tage    = zusammenfassung.zeitExternRest.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitRemote.tage        = zusammenfassung.zeitRemote.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitVorOrtGeplant.tage = zusammenfassung.zeitVorOrtGeplant.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitVorOrtRest.tage    = zusammenfassung.zeitVorOrtRest.stunden / arbeitsZeitProTag;
        
        return zusammenfassung;
    }
    
    private createKeinRemote( date : Date ) : KeinRemote {
        return {
            dateString : CalculatorStore.dateToString( date ),
            ganzerTag  : true,
            typ        : KeinRemoteTyp.ABWESEND,
        }
    }
    
    private addAndRemoveDuplicateRemotes( newRemotes : KeinRemote[] ) {
        let oldRemotes = this._keinRemote;
        
        newRemotes.forEach( n => {
            oldRemotes = oldRemotes.filter( r => r.dateString !== n.dateString );
        } );
        
        return [
            ...oldRemotes,
            ...newRemotes
        ];
    }
    
    addKeinRemote( start : Date, end ? : Date | null ) {
        const kr : KeinRemote[] = [];
        if ( !end ) {
            kr.push( this.createKeinRemote( start ) );
        } else {
            for ( const d = start; d <= end; d.setDate( d.getDate() + 1 ) ) {
                kr.push( this.createKeinRemote( d ) );
            }
        }
        this._keinRemote = this.addAndRemoveDuplicateRemotes( kr );
    }
    
    removeKeinRemote( dateString : string ) {
        this._keinRemote = this._keinRemote.filter( r => r.dateString !== dateString );
    }
    
}

export const CalculatorStoreContext = createContext<CalculatorStore>( new CalculatorStore() );

export const CalculatorStoreProvider : FC<{
    store : CalculatorStore,
    children : React.ReactNode
}> = ( { store, children } ) => {
    return (
        <CalculatorStoreContext.Provider value={ store }>
            { children }
        </CalculatorStoreContext.Provider>
    );
};

export const useCalculatorStore = () => {
    return useContext( CalculatorStoreContext );
}
