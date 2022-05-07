import styled           from '@emotion/styled';
import { TimeBar }      from 'Components/TimeBar';
import { startOfMonth } from 'date-fns';
import { format }       from 'date-fns';
import { endOfWeek }    from 'date-fns';
import { endOfMonth }   from 'date-fns';
import { startOfWeek }  from 'date-fns';
import { de }           from 'date-fns/locale';
import { Wochentag }    from 'Models/Enum/Wochentag';
import React            from 'react';
import { observer }     from 'mobx-react';

import { Tag }                from 'Models/Tag';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';

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
  height          : 3rem;
`;

const Day = styled( Cell )`
  color  : var(--rs-text-primary);
  border : 1px solid var(--rs-border-primary);
`;

const NoWorkingDay = styled( Cell )`
  color           : var(--rs-border-primary);
  border          : 1px solid var(--rs-border-primary);
  text-decoration : line-through;
`;

const Month = styled( Cell )`
  color : var(--rs-text-primary);
`;

interface Props {
    start : string;
}

export const Calendar = observer( ( props : Props ) => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    const start                        = CalculatorStore.stringToDate( props.start );
    const firstDay                     = startOfWeek( startOfMonth( start ), { weekStartsOn : 1 } );
    const lastDay                      = endOfWeek( endOfMonth( start ), { weekStartsOn : 1 } );
    
    const days : Date[] = [];
    
    for ( const d = firstDay; d <= lastDay; d.setDate( d.getDate() + 1 ) ) {
        days.push( new Date( d.getTime() ) );
    }
    
    days.sort( ( a, b ) => a.getTime() - b.getTime() );
    
    const wochentage = [ ...Object.keys( Wochentag ), 'Samstag', 'Sonntag' ];
    
    return <div>
        <Month>{ format( start, 'LLLL', { locale : de } ) }</Month>
        <Container>
            { wochentage.map( t => {
                return <Cell key={ 'header-tag-' + t }>
                    { t.substring( 0, 2 ) }
                </Cell>
            } ) }
            { days.map( date => {
                const dateString = CalculatorStore.dateToString( date );
                const dayString  = format( date, 'd' );
                const isInMonth  = start.getMonth() === date.getMonth();
                const key        = 'cal-day-' + dateString;
                
                if ( !isInMonth ) {
                    return <Cell key={ key }>
                        { dayString }
                    </Cell>;
                }
                
                const tag = calculator.zusammenfassung.tage.find( t => t.dateString === dateString );
                
                if(!tag || tag.istFeiertagOderWE) {
                    return <NoWorkingDay key={ key }>
                        { dayString }
                    </NoWorkingDay>;
                }
                
                return <Day key={ key }>
                    <div style={ { width : '100%' } }>
                        { dayString }<br/>
                        <TimeBar tag={ tag }/>
                    </div>
                </Day>
            } ) }
        </Container>
    </div>
} );
