import styled                 from '@emotion/styled';
import { startOfMonth }       from 'date-fns';
import { format }             from 'date-fns';
import { endOfWeek }          from 'date-fns';
import { endOfMonth }         from 'date-fns';
import { startOfWeek }        from 'date-fns';
import { de }                 from 'date-fns/locale';
import React                  from 'react';
import { observer }           from 'mobx-react';
import { TimeBar }            from 'Components/TimeBar';
import { Wochentag }          from 'Models/Enum/Wochentag';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';
import { BREAK }              from 'Styles/media';
import { dateToString }       from 'Util/date';
import { stringToDate }       from 'Util/date';
import { twoDigit }           from 'Util/twoDigit';

const Overflow = styled.div`
  overflow : hidden;
`;

const Container = styled.div`
  display         : flex;
  flex-wrap       : wrap;
  justify-content : stretch;
`;

const Cell = styled.div`
  flex-grow       : 1;
  width           : ${ 100 / 8 }%;
  padding         : 4px;
  margin          : 2px;
  overflow        : hidden;
  border-radius   : 6px;
  cursor          : default;
  text-align      : center;
  color           : var(--rs-border-primary);
  display         : flex;
  justify-content : center;
  align-items     : center;
  height          : 38px;
  opacity         : 0.3;

  ${ BREAK.S } {
    height : 46px;
  }

`;

const Header = styled( Cell )`
  opacity : 1;
`;

const Day = styled( Cell )`
  color   : var(--rs-text-primary);
  border  : 1px solid var(--rs-border-primary);
  opacity : 1;
`;

const NoWorkingDay = styled( Cell )`
  color           : var(--rs-border-primary);
  border          : 1px solid var(--rs-border-primary);
  text-decoration : line-through;
  opacity         : 1;
`;

const OutsideOfRange = styled( Cell )`
  color  : var(--rs-border-primary);
  border : 1px solid var(--rs-border-primary);
`;

const Month = styled.div`
  display         : flex;
  justify-content : space-between;
  align-items     : baseline;

  & > div {
    color         : var(--rs-border-primary);
    padding-right : 3px;
  }
`;

interface Props {
    start : string;
}

export const Calendar = observer( ( props : Props ) => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    const start                        = stringToDate( props.start );
    const firstDayMonth                = startOfMonth( start );
    const firstDay                     = startOfWeek( firstDayMonth, { weekStartsOn : 1 } );
    const lastDayMonth                 = endOfMonth( start );
    const lastDay                      = endOfWeek( lastDayMonth, { weekStartsOn : 1 } );
    
    let days : Date[] = [];
    
    for ( const d = firstDay; d <= lastDay; d.setDate( d.getDate() + 1 ) ) {
        days.push( new Date( d.getTime() ) );
    }
    
    days.sort( ( a, b ) => a.getTime() - b.getTime() );
    
    let arbeitszeit = 0;
    let tage        = 0;
    days.forEach( d => {
        const tag     = calculator.zusammenfassung.tage.find( t => t.dateString === dateToString( d ) );
        const inRange = firstDayMonth <= d && d <= lastDayMonth;
        if ( inRange && tag && !tag.istFeiertagOderWE ) {
            arbeitszeit += tag.stundenZuArbeiten;
            tage++;
        }
    } );
    
    const wochentage = [ ...Object.keys( Wochentag ), 'Samstag', 'Sonntag' ];
    
    return <Overflow>
        <Month>
            <h4>{ format( start, 'LLLL', { locale : de } ) }</h4>
            <div>{ twoDigit( arbeitszeit ) } Stunden / { tage } Tage</div>
        </Month>
        <Container>
            { wochentage.map( t => {
                return <Header key={ 'header-tag-' + t }>
                    { t.substring( 0, 2 ) }
                </Header>
            } ) }
            { days.map( date => {
                const dateString = dateToString( date );
                const dayString  = format( date, 'd' );
                const isInMonth  = start.getMonth() === date.getMonth();
                const key        = 'cal-day-' + dateString;
                
                if ( !isInMonth ) {
                    return <Cell key={ key }>
                        { dayString }
                    </Cell>;
                }
                
                const tag = calculator.zusammenfassung.tage.find( t => t.dateString === dateString );
                
                if ( !tag ) {
                    return <OutsideOfRange key={ key }>
                        { dayString }
                    </OutsideOfRange>;
                }
                
                if ( !tag || tag.istFeiertagOderWE ) {
                    return <NoWorkingDay key={ key }>
                        { dayString }
                    </NoWorkingDay>;
                }
                
                return <Day key={ key }>
                    <div style={ { width : '100%' } }>
                        { dayString }{ /* tag.istLetzterTagRZ || tag.istLetzterTagSZ ? ' !!!' : '' */ }
                        <TimeBar tag={ tag }/>
                    </div>
                </Day>
            } ) }
        </Container>
    </Overflow>
} );
