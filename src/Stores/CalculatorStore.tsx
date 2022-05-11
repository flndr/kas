import { Zeiten }             from 'Models/Zeiten';
import React                  from 'react';
import { FC }                 from 'react';
import { useContext }         from 'react';
import { createContext }      from 'react';
import { startOfMonth }       from 'date-fns';
import { isSaturday }         from 'date-fns';
import { getYear }            from 'date-fns';
import { format }             from 'date-fns';
import { isSunOrHoliday }     from 'feiertagejs';
import { getHolidays }        from 'feiertagejs';
import { Region }             from 'feiertagejs';
import { Holiday }            from 'feiertagejs';
import { toJS }               from 'mobx';
import { makeAutoObservable } from 'mobx';
import { makePersistable }    from 'mobx-persist-store';
import { stopPersisting }     from 'mobx-persist-store';
import { Arbeitszeit }        from 'Models/Arbeitszeit';
import { TerminTyp }          from 'Models/Enum/TerminTyp';
import { Wochentag }          from 'Models/Enum/Wochentag';
import { Tag }                from 'Models/Tag';
import { TerminStore }        from 'Models/TerminStore';
import { TerminTagweise }     from 'Models/TerminTagweise';
import { Zusammenfassung }    from 'Models/Zusammenfassung';
import { toString }           from 'Util/date';
import { dateToString }       from 'Util/date';
import { stringToDate }       from 'Util/date';
import { toNumber }           from 'Util/toNumber';

export class CalculatorStore {
    
    readonly region : Region = 'BY';
    readonly holidays : Holiday[];
    
    _termine : TerminStore[] = [];
    
    _reststundenRZ : number   = 580;
    _reststundenSZ : number   = 300;
    _ersterTagAbruf : string  = '2022-05-01';
    _letzterTagAbruf : string = '2022-10-31';
    
    _arbeitszeiten : Arbeitszeit = {
        [ Wochentag.Montag ]     : 8.25,
        [ Wochentag.Dienstag ]   : 8.25,
        [ Wochentag.Mittwoch ]   : 8.25,
        [ Wochentag.Donnerstag ] : 8.25,
        [ Wochentag.Freitag ]    : 8.25,
    };
    
    constructor() {
        makeAutoObservable( this );
        
        makePersistable( this, {
            name       : 'CalculatorStore',
            storage    : window.localStorage,
            properties : [
                '_arbeitszeiten',
                '_termine',
                '_ersterTagAbruf',
                '_letzterTagAbruf',
                '_reststundenRZ',
                '_reststundenSZ',
            ]
        } );
        
        const currentYear = getYear( new Date() );
        this.holidays     = [
            ...getHolidays( currentYear - 1, this.region ),
            ...getHolidays( currentYear + 0, this.region ),
            ...getHolidays( currentYear + 1, this.region ),
        ];
    }
    
    stopStore() {
        stopPersisting( this );
    }
    
    get letzterTagAbruf() : Date {
        return stringToDate( this._letzterTagAbruf );
    }
    
    get ersterTagAbruf() : Date {
        return stringToDate( this._ersterTagAbruf );
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
        for ( const d = new Date( this.ersterTagAbruf.getTime() ); d <= this.letzterTagAbruf; d.setDate( d.getDate() + 1 ) ) {
            callback( d, dateToString( d ) );
        }
    }
    
    getArbeitszeit( w : Wochentag ) : number {
        return this._arbeitszeiten[ w ];
    }
    
    setArbeitszeit( w : Wochentag, value : number | string ) {
        this._arbeitszeiten = {
            ...this._arbeitszeiten,
            [ w ] : toNumber( value )
        }
    }
    
    get reststundenRZ() : number {
        return this._reststundenRZ;
    }
    
    get reststundenSZ() : number {
        return this._reststundenSZ;
    }
    
    setReststundenRZ( value : string | number ) {
        this._reststundenRZ = toNumber( value );
    }
    
    setReststundenSZ( value : string | number ) {
        this._reststundenSZ = toNumber( value );
    }
    
    setLetzterTagAbruf( date : Date | null ) {
        if ( date ) {
            this._letzterTagAbruf = dateToString( date );
        }
    }
    
    setErsterTagAbruf( date : Date | null ) {
        if ( date ) {
            this._ersterTagAbruf = dateToString( date );
        }
    }
    
    istFeiertagOderWE( date : Date ) : boolean {
        return isSaturday( date ) || isSunOrHoliday( date, this.region );
    }
    
    istUrlaubstag( dateString : string ) : boolean {
        if ( this.istFeiertagOderWE( stringToDate( dateString ) ) ) {
            return false;
        }
        return this.termine.filter( t => t.dateString === dateString && t.typ === TerminTyp.URLAUB ).length > 0;
    }
    
    istVorOrtTag( dateString : string ) : boolean {
        return this.termine.filter( t => t.dateString === dateString && t.typ === TerminTyp.VORORT ).length > 0;
    }
    
    istExternGanztaegig( dateString : string ) : boolean {
        return this.termine.filter( t =>
            t.dateString === dateString &&
            t.typ === TerminTyp.EXTERN &&
            t.stunden === undefined
        ).length > 0;
    }
    
    getGeplanteExternStunden( dateString : string ) : number {
        return this.termine
                   .filter( t => t.dateString === dateString && t.typ === TerminTyp.EXTERN )
                   .map( t => t.stunden || 0 )
                   .reduce( ( prev, curr ) => prev + curr, 0 );
    }
    
    getStundenProTag( date : Date ) : number {
        const wochentag = format( date, 'EEEE' );
        return this._arbeitszeiten[ wochentag as Wochentag ] || 0;
    }
    
    get monate() : string[] {
        const m : string[] = [];
        this.forEachDay( ( date ) => {
            const firstOfMonthString = dateToString( startOfMonth( date ) );
            if ( !m.includes( firstOfMonthString ) ) {
                m.push( firstOfMonthString );
            }
        } );
        return m;
    }
    
    get zusammenfassung() : Zusammenfassung {
        
        const arbeitsZeitProTag = this.durchschnittleicheArbeitszeitProTag;
        
        const zusammenfassung : Zusammenfassung = {
            zeitGesamt        : { stunden : 0, tage : 0 },
            zeitFeierOderWE   : { stunden : 0, tage : 0 },
            zeitUrlaub        : { stunden : 0, tage : 0 },
            zeitZuArbeiten    : { stunden : 0, tage : 0 },
            zeitGearbeitet    : { stunden : 0, tage : 0 },
            zeitExternGeplant : { stunden : 0, tage : 0 },
            zeitExternRest    : { stunden : 0, tage : 0 },
            zeitRemote        : { stunden : 0, tage : 0 },
            zeitVorOrtGeplant : { stunden : 0, tage : 0 },
            zeitVorOrtRest    : { stunden : 0, tage : 0 },
            letzterTagRZ      : undefined,
            letzterTagSZ      : undefined,
            tage              : []
        };
        
        let tage : Tag[] = [];
        
        this.forEachDay( ( date : Date, dateString : string ) => {
            
            const istFeiertagOderWE       = this.istFeiertagOderWE( date );
            const istUrlaubstag           = this.istUrlaubstag( dateString );
            const istExternGanztaegig     = this.istExternGanztaegig( dateString );
            const istVorOrtTagGeplant     = this.istVorOrtTag( dateString );
            const istArbeitstag           = !( istUrlaubstag || istFeiertagOderWE );
            const stundenZuArbeitenCustom = this.getStundenProTag( date );
            
            const tag : Tag = {
                date,
                dateString,
                istArbeitstag,
                istFeiertagOderWE,
                istUrlaubstag,
                istExternGanztaegig,
                istLetzterTagRZ      : false,
                istLetzterTagSZ      : false,
                stundenExternGeplant : 0,
                stundenExternRest    : 0,
                stundenRemote        : 0,
                stundenVorOrtGeplant : 0,
                stundenVorOrtRest    : 0,
                stundenUrlaub        : 0,
                stundenZuArbeiten    : arbeitsZeitProTag,
                stundenGearbeitet    : stundenZuArbeitenCustom,
            };
            
            if ( istFeiertagOderWE ) {
                tag.stundenZuArbeiten = 0;
                tag.stundenGearbeitet = 0;
            } else if ( istUrlaubstag ) {
                tag.stundenZuArbeiten = 0;
                tag.stundenGearbeitet = 0;
                tag.stundenUrlaub     = arbeitsZeitProTag;
            } else if ( istExternGanztaegig ) {
                tag.stundenExternGeplant = stundenZuArbeitenCustom;
            } else { // RZ oder SZ
                if ( istVorOrtTagGeplant ) {
                    tag.stundenExternGeplant = this.getGeplanteExternStunden( dateString );
                    tag.stundenVorOrtGeplant = stundenZuArbeitenCustom - tag.stundenExternGeplant;
                } else {
                    tag.stundenExternGeplant = this.getGeplanteExternStunden( dateString );
                    tag.stundenRemote        = stundenZuArbeitenCustom - tag.stundenExternGeplant;
                }
            }
            
            tage.push( tag );
        } );
        
        // limit RZ
        let stundenRzVerfuegbar = 1 + this._reststundenRZ - 1;
        let stundenRzVoll       = false;
        
        tage = tage.map( tag => {
            if ( !tag.istFeiertagOderWE &&
                 !tag.istUrlaubstag &&
                 !tag.istExternGanztaegig ) {
                
                if ( stundenRzVerfuegbar >= tag.stundenRemote ) {
                    stundenRzVerfuegbar = stundenRzVerfuegbar - tag.stundenRemote;
                } else {
                    if ( !stundenRzVoll ) {
                        stundenRzVoll         = true;
                        tag.stundenRemote     = stundenRzVerfuegbar;
                        tag.stundenVorOrtRest = tag.stundenGearbeitet - tag.stundenRemote;
                        tag.istLetzterTagRZ   = true;
                        stundenRzVerfuegbar   = 0;
                    } else {
                        tag.stundenVorOrtRest = tag.stundenRemote;
                        tag.stundenRemote     = 0;
                    }
                }
            }
            return tag;
        } );
        
        // limit SZ
        const stundenVorOrtVerplant = tage.map( t => t.stundenVorOrtGeplant ).reduce( ( prev, cur ) => prev + cur, 0 );
        let stundenSzVerfuegbar     = 1 + this._reststundenSZ - 1 - stundenVorOrtVerplant;
        let stundenSzVoll           = false;
        
        tage = tage.map( tag => {
            if ( !tag.istFeiertagOderWE &&
                 !tag.istUrlaubstag &&
                 !tag.istExternGanztaegig ) {
                
                if ( stundenSzVerfuegbar >= tag.stundenVorOrtRest ) {
                    stundenSzVerfuegbar = stundenSzVerfuegbar - tag.stundenVorOrtRest;
                } else {
                    if ( !stundenSzVoll ) {
                        stundenSzVoll         = true;
                        tag.stundenVorOrtRest = stundenSzVerfuegbar;
                        tag.stundenExternRest = tag.stundenGearbeitet - tag.stundenVorOrtRest;
                        tag.istLetzterTagSZ   = true;
                        stundenSzVerfuegbar   = 0;
                    } else {
                        tag.stundenExternRest = tag.stundenVorOrtRest;
                        tag.stundenVorOrtRest = 0;
                    }
                }
            }
            return tag;
        } );
        
        tage.forEach( tag => {
            console.log( tag.dateString );
            zusammenfassung.zeitGesamt.stunden += arbeitsZeitProTag;
            if ( tag.istFeiertagOderWE ) {
                zusammenfassung.zeitFeierOderWE.stunden += arbeitsZeitProTag;
            } else if ( tag.istUrlaubstag ) {
                zusammenfassung.zeitUrlaub.stunden += arbeitsZeitProTag;
            } else {
                zusammenfassung.zeitZuArbeiten.stunden += tag.stundenZuArbeiten;
                zusammenfassung.zeitGearbeitet.stunden += tag.stundenGearbeitet;
                zusammenfassung.zeitExternGeplant.stunden += tag.stundenExternGeplant;
                zusammenfassung.zeitExternRest.stunden += tag.stundenExternRest;
                zusammenfassung.zeitRemote.stunden += tag.stundenRemote;
                zusammenfassung.zeitVorOrtGeplant.stunden += tag.stundenVorOrtGeplant;
                zusammenfassung.zeitVorOrtRest.stunden += tag.stundenVorOrtRest;
            }
        } );
        
        zusammenfassung.tage                   = tage;
        zusammenfassung.zeitGesamt.tage        = zusammenfassung.zeitGesamt.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitFeierOderWE.tage   = zusammenfassung.zeitFeierOderWE.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitUrlaub.tage        = zusammenfassung.zeitUrlaub.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitZuArbeiten.tage    = zusammenfassung.zeitZuArbeiten.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitGearbeitet.tage    = zusammenfassung.zeitGearbeitet.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitExternGeplant.tage = zusammenfassung.zeitExternGeplant.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitExternRest.tage    = zusammenfassung.zeitExternRest.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitRemote.tage        = zusammenfassung.zeitRemote.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitVorOrtGeplant.tage = zusammenfassung.zeitVorOrtGeplant.stunden / arbeitsZeitProTag;
        zusammenfassung.zeitVorOrtRest.tage    = zusammenfassung.zeitVorOrtRest.stunden / arbeitsZeitProTag;
        
        return zusammenfassung;
    }
    
    addTermin( typ : TerminTyp, start : Date | string, end ? : Date | string | null ) {
        
        const termin : TerminStore = {
            typ,
            dateStringStart : start instanceof Date ? dateToString( start ) : start,
            dateStringEnde  : end ? ( end instanceof Date ? dateToString( end ) : end ) : undefined
        };
        
        this._termine = [
            ...this._termine,
            termin
        ].sort( this.terminStoreSorter );
        
    }
    
    private terminStoreSorter( a : TerminStore, b : TerminStore ) : number {
        const dateA = stringToDate( a.dateStringStart ).getTime();
        const dateB = stringToDate( b.dateStringStart ).getTime();
        return dateA - dateB;
    }
    
    private terminTagweiseSorter( a : TerminTagweise, b : TerminTagweise ) : number {
        const dateA = stringToDate( a.dateString ).getTime();
        const dateB = stringToDate( b.dateString ).getTime();
        return dateA - dateB;
    }
    
    get termine() : TerminTagweise[] {
        const termine : TerminTagweise[] = [];
        
        this._termine.forEach( t => {
            if ( !t.dateStringEnde ) {
                
                if ( !t.repeat ) {
                    termine.push( {
                        typ        : t.typ,
                        dateString : t.dateStringStart,
                        stunden    : t.stunden || undefined
                    } );
                } else {
                    const wochentag = format( stringToDate( t.dateStringStart ), 'EEEE' );
                    this.forEachDay( ( date, dateString ) => {
                        if ( wochentag === format( date, 'EEEE' ) ) {
                            termine.push( {
                                typ        : t.typ,
                                dateString : dateString,
                                stunden    : t.stunden || undefined
                            } );
                        }
                    } );
                }
                
            } else {
                for ( const d = stringToDate( t.dateStringStart );
                      d <= stringToDate( t.dateStringEnde );
                      d.setDate( d.getDate() + 1 ) ) {
                    termine.push( {
                        typ        : t.typ,
                        dateString : dateToString( d ),
                        stunden    : t.stunden || undefined
                    } );
                }
            }
        } );
        
        return termine.sort( this.terminTagweiseSorter );
    }
    
    removeTermin( typ : TerminTyp, start : Date | string ) {
        const dateStringStart = toString( start );
        
        this._termine =
            toJS( this._termine )
            .filter( a => {
                return !( a.dateStringStart === dateStringStart && a.typ === typ )
            } )
            .sort( this.terminStoreSorter );
    }
    
    updateTermin( typ : TerminTyp, start : Date | string, terminUpdate : Partial<TerminStore> ) {
        const dateStringStart = toString( start );
        
        const terminOld = toJS( this._termine )
        .find( a => a.dateStringStart === dateStringStart && a.typ === typ );
        
        if ( terminOld ) {
            const terminNeu = {
                ...terminOld,
                ...terminUpdate
            };
            
            this.removeTermin( terminOld.typ, terminOld.dateStringStart );
            this._termine = [
                ...this._termine,
                terminNeu
            ].sort( this.terminStoreSorter );
        }
    }
    
    get abrufZeitenGesamt() : Zeiten {
        return {
            tage    : ( this.reststundenRZ + this.reststundenSZ ) / this.durchschnittleicheArbeitszeitProTag,
            stunden : ( this.reststundenRZ + this.reststundenSZ )
        };
    }
    
    get saldoReststunden() : Zeiten {
        return {
            tage    : this.zusammenfassung.zeitZuArbeiten.tage
                      - this.abgerufenZeiten.tage
                      - this.zusammenfassung.zeitExternGeplant.tage,
            stunden : this.zusammenfassung.zeitZuArbeiten.stunden
                      - this.abgerufenZeiten.stunden
                      - this.zusammenfassung.zeitExternGeplant.stunden
        }
    }
    
    get saldoAbruf() : Zeiten {
        return {
            tage    : this.abrufZeitenGesamt.tage
                      - this.zusammenfassung.zeitVorOrtGeplant.tage
                      - this.zusammenfassung.zeitVorOrtRest.tage
                      - this.zusammenfassung.zeitRemote.tage,
            stunden : this.abrufZeitenGesamt.stunden
                      - this.zusammenfassung.zeitVorOrtGeplant.stunden
                      - this.zusammenfassung.zeitVorOrtRest.stunden
                      - this.zusammenfassung.zeitRemote.stunden,
        }
    }
    
    get abgerufenZeiten() : Zeiten {
        return {
            tage    : this.zusammenfassung.zeitVorOrtGeplant.tage
                      + this.zusammenfassung.zeitVorOrtRest.tage
                      + this.zusammenfassung.zeitRemote.tage,
            stunden : this.zusammenfassung.zeitVorOrtGeplant.stunden
                      + this.zusammenfassung.zeitVorOrtRest.stunden
                      + this.zusammenfassung.zeitRemote.stunden,
        }
    }
    
    get abgerufenRestZeiten() : Zeiten {
        return {
            tage    : this.zusammenfassung.zeitVorOrtRest.tage
                      + this.zusammenfassung.zeitRemote.tage,
            stunden : this.zusammenfassung.zeitVorOrtRest.stunden
                      + this.zusammenfassung.zeitRemote.stunden,
        }
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
