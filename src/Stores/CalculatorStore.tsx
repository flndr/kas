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

import { Arbeitszeit }   from 'Models/Arbeitszeit';
import { KeinRemoteTyp } from 'Models/Enum/KeinRemoteTyp';
import { Wochentag }     from 'Models/Enum/Wochentag';
import { KeinRemote }    from 'Models/KeinRemote';
import { Tag }           from 'Models/Tag';
import React             from 'react';
import { FC }            from 'react';
import { useContext }    from 'react';
import { createContext } from 'react';

export class CalculatorStore {
    
    static readonly dateFormat : string = 'yyyy-MM-dd';
    
    readonly today : string;
    readonly region : Region = 'BY';
    readonly holidays : Holiday[];
    
    _arbeitszeiten : Arbeitszeit = {
        [ Wochentag.Montag ]     : 8.25,
        [ Wochentag.Dienstag ]   : 8.25,
        [ Wochentag.Mittwoch ]   : 8.25,
        [ Wochentag.Donnerstag ] : 8.25,
        [ Wochentag.Freitag ]    : 8.25,
    }
    
    _keinRemote : KeinRemote[] = [];
    _reststunden : number      = 100;
    _letzterTagAbruf : string  = '2022-05-30';
    
    constructor() {
        makeAutoObservable( this );
        
        makePersistable( this, {
            name       : 'ReststundenStore',
            storage    : window.localStorage,
            properties : [
                '_arbeitszeiten',
                '_keinRemote',
                '_letzterTagAbruf',
                '_reststunden',
            ]
        } );
        
        const currentDate = CalculatorStore.stringToDate( '2022-05-09' ); // TODO use --> new Date();
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
    
    get reststunden() : number {
        return this._reststunden;
    }
    
    setReststunden( value : string | number ) {
        if ( typeof value === 'string' ) {
            this._reststunden = parseFloat( value );
        } else {
            this._reststunden = value;
        }
    }
    
    setLetzterTagAbruf( date : Date | null ) {
        if ( date ) {
            this._letzterTagAbruf = CalculatorStore.dateToString( date );
        }
    }
    
    isFeiertagOderWE( date : Date ) : boolean {
        return isSaturday( date ) || isSunOrHoliday( date, this.region );
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
        console.log( CalculatorStore.dateToString( date ), wochentag )
        return this._arbeitszeiten[ wochentag as Wochentag ] || 0;
    }
    
    get tage() : Tag[] {
        const tage : Tag[] = [];
        
        const start = CalculatorStore.stringToDate( this.today );
        
        for ( const d = start; d <= this.letzterTagAbruf; d.setDate( d.getDate() + 1 ) ) {
            const dateString = CalculatorStore.dateToString( d );
            
            const istArbeitstag     = !this.isFeiertagOderWE( d );
            const stundenZuArbeiten = istArbeitstag ? this.getStundenProTag( d ) : 0;
            const stundenGearbeitet = istArbeitstag ? ( stundenZuArbeiten - this.getStundenAbwesend( dateString ) ) : 0;
            
            console.log( dateString, istArbeitstag, stundenZuArbeiten );
            
            const tag : Tag = {
                dateString,
                istArbeitstag,
                stundenZuArbeiten,
                stundenGearbeitet,
                keinRemote : istArbeitstag
                             ? ( this._keinRemote.find( r => r.dateString === dateString ) || undefined )
                             : undefined,
            };
            tage.push( tag );
        }
        return tage;
    }
    
    get summary() : {
        stundenZuArbeiten : number,
        stundenGearbeitet : number,
    } {
        let stundenZuArbeiten = 0;
        let stundenGearbeitet = 0;
        this.tage.forEach( t => {
            stundenZuArbeiten += t.stundenZuArbeiten;
            stundenGearbeitet += t.stundenGearbeitet;
        } );
        return {
            stundenZuArbeiten,
            stundenGearbeitet
        }
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
