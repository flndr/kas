import React                  from 'react';
import { FC }                 from 'react';
import { useContext }         from 'react';
import { createContext }      from 'react';
import { isSaturday }         from 'date-fns';
import { getYear }            from 'date-fns';
import { parse }              from 'date-fns';
import { format }             from 'date-fns';
import { isSunOrHoliday }     from 'feiertagejs';
import { getHolidays }        from 'feiertagejs';
import { Region }             from 'feiertagejs';
import { Holiday }            from 'feiertagejs';
import { makeAutoObservable } from 'mobx';
import { Tag }                from 'Models/Anwesenheiten';
import { Arbeitszeiten }      from 'Models/Arbeitszeiten';
import { Wochentag }          from 'Models/Wochentag';

export class ReststundenStore {
    
    static readonly dateFormat : string = 'yyyy-MM-dd';
    
    readonly today : string;
    readonly region : Region = 'BY';
    readonly holidays : Holiday[];
    
    _arbeitszeiten : Arbeitszeiten = {
        [ Wochentag.Montag ]     : 8.25,
        [ Wochentag.Dienstag ]   : 8.25,
        [ Wochentag.Mittwoch ]   : 8.25,
        [ Wochentag.Donnerstag ] : 8.25,
        [ Wochentag.Freitag ]    : 8.25,
    }
    
    //_abwesenheiten : Abwesenheiten = [];
    private _stundenProTag : number = 8.25;
    private _reststunden : number   = 200;
    private _abwesenheiten : Tag[]  = [];
    private _letzterTagAbruf : Date = ReststundenStore.stringToDate( '2022-05-15' );
    
    constructor() {
        makeAutoObservable( this );
        const currentDate = new Date();
        const currentYear = getYear( currentDate );
        this.today        = ReststundenStore.dateToString( currentDate );
        this.holidays     = [
            ...getHolidays( currentYear - 1, this.region ),
            ...getHolidays( currentYear + 0, this.region ),
            ...getHolidays( currentYear + 1, this.region ),
        ];
    }
    
    get arbeitszeitProWoche() : number {
        let zeit = 0;
        Object.values( this._arbeitszeiten ).forEach( z => zeit += z );
        return zeit;
    }
    
    get arbeitszeitProTag() : number {
        return this.arbeitszeitProWoche / 5;
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
        return format( date, ReststundenStore.dateFormat );
    }
    
    static stringToDate( date : string ) : Date {
        return parse( date, ReststundenStore.dateFormat, new Date() );
    }
    
    get reststunden() : number {
        return this._reststunden;
    }
    
    setReststunden( value : string | number ) {
        console.log( 'setReststunden', value );
        if ( typeof value === 'string' ) {
            this._reststunden = parseFloat( value );
        } else {
            this._reststunden = value;
        }
    }
    
    get letzterTagAbruf() : Date {
        return this._letzterTagAbruf;
    }
    
    setLetzterTagAbruf( date : Date | null ) {
        if ( date ) {
            this._letzterTagAbruf = date;
        }
    }
    
    isFeierOderWE( date : Date ) : boolean {
        return isSaturday( date ) || isSunOrHoliday( date, this.region );
    }
    
    getZeitAbwesend( dateString : string ) : number {
        const abwesend = this._abwesenheiten.find( a => a.dateString === dateString );
        return abwesend ? abwesend.zeitAbzglAbwesenheit : 0;
    }
    
    get abwesenheiten() : Tag[] {
        const tage : Tag[] = [];
        
        const start = ReststundenStore.stringToDate( this.today );
        
        for ( const d = start; d <= this._letzterTagAbruf; d.setDate( d.getDate() + 1 ) ) {
            const dateString        = ReststundenStore.dateToString( d );
            const istFeiertagOderWE = this.isFeierOderWE( d );
            tage.push( {
                dateString,
                istFeiertagOderWE,
                zeitAbzglAbwesenheit : this._stundenProTag - this.getZeitAbwesend( dateString ),
                zeitZuArbeiten       : istFeiertagOderWE ? 0 : this._stundenProTag
            } );
        }
        return tage;
    }
    
    get zeitZuArbeitenBisAblaufEnde() : number {
        let zeitZuArbeiten = 0;
        this.abwesenheiten.filter( a => !a.istFeiertagOderWE ).forEach( a => zeitZuArbeiten += a.zeitZuArbeiten );
        return zeitZuArbeiten;
    }
    
    get zeitAbzglAbwesenheitBisAblaufEnde() : number {
        let zeitAbzglAbwesenheit = 0;
        this.abwesenheiten.filter( a => !a.istFeiertagOderWE ).forEach( a => zeitAbzglAbwesenheit += a.zeitAbzglAbwesenheit );
        return zeitAbzglAbwesenheit;
    }
    
    get zeitAbwesenheitBisAblaufEnde() : number {
        return this.zeitZuArbeitenBisAblaufEnde - this.zeitAbzglAbwesenheitBisAblaufEnde;
    }
    
    get buchungProTag() : number {
        return this._reststunden / (this.zeitAbzglAbwesenheitBisAblaufEnde / this.arbeitszeitProTag);
    }
    
    addAbwesenheit( start : Date, end ? : Date | null ) {
        
        const tage : Tag[] = [];
        
        if ( !end ) {
            const istFeiertagOderWE = this.isFeierOderWE( start );
            tage.push( {
                dateString           : ReststundenStore.dateToString( start ),
                istFeiertagOderWE,
                zeitAbzglAbwesenheit : this._stundenProTag,
                zeitZuArbeiten       : istFeiertagOderWE ? 0 : this._stundenProTag
            } );
        } else {
            for ( const d = start; d <= end; d.setDate( d.getDate() + 1 ) ) {
                const istFeiertagOderWE = this.isFeierOderWE( d );
                tage.push( {
                    dateString           : ReststundenStore.dateToString( d ),
                    istFeiertagOderWE,
                    zeitAbzglAbwesenheit : this._stundenProTag,
                    zeitZuArbeiten       : istFeiertagOderWE ? 0 : this._stundenProTag
                } );
            }
        }
        
        this._abwesenheiten = [
            ...this._abwesenheiten,
            ...tage
        ];
    }
    
}

export const ReststundenStoreContext = createContext<ReststundenStore>( new ReststundenStore() );

export const ReststundenStoreProvider : FC<{
    store : ReststundenStore,
    children : React.ReactNode
}> = ( { store, children } ) => {
    return (
        <ReststundenStoreContext.Provider value={ store }>
            { children }
        </ReststundenStoreContext.Provider>
    );
};

export const useReststundenStore = () => {
    return useContext( ReststundenStoreContext );
}
