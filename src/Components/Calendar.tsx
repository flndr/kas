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
  flex-grow     : 1;
  width         : ${ 100 / 8 }%;
  padding       : 4px;
  margin        : 2px;
  overflow      : hidden;
  border-radius : 6px;
  cursor        : default;
  text-align    : center;
  color         : var(--rs-border-primary);
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
    start : Date;
}

export const Calendar = observer( ( props : Props ) => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    const firstDay = startOfWeek( startOfMonth( props.start ), { weekStartsOn : 1 } );
    const lastDay  = endOfWeek( endOfMonth( props.start ), { weekStartsOn : 1 } );
    
    const days : Date[] = [];
    
    for ( const d = firstDay; d <= lastDay; d.setDate( d.getDate() + 1 ) ) {
        days.push( new Date( d.getTime() ) );
    }
    
    days.sort( ( a, b ) => a.getTime() - b.getTime() );
    
    const wochentage = [ ...Object.keys( Wochentag ), 'Samstag', 'Sonntag' ];
    
    return <>
        <Month>{ format( props.start, 'LLLL', { locale : de } ) }</Month>
        <Container>
            { wochentage.map( t => {
                return <Cell key={ 'header-tag-' + t }>
                    { t.substring( 0, 2 ) }
                </Cell>
            } ) }
            { days.map( date => {
                const dateString = CalculatorStore.dateToString( date );
                const dayString  = format( date, 'd' );
                const isInMonth  = props.start.getMonth() === date.getMonth();
                const key        = 'cal-day-' + dateString;
                
                if ( !isInMonth ) {
                    return <Cell key={ key }>
                        { dayString }
                    </Cell>;
                }
                
                const tag = calculator.tage.find( t => t.dateString === dateString );
                
                if ( !tag || !tag.istArbeitstag ) {
                    return <NoWorkingDay key={ key }>
                        { dayString }
                    </NoWorkingDay>;
                }
                
                return <Day key={ key }>
                    { dayString }<br/>
                    <TimeBar tag={ tag }/>
                </Day>
            } ) }
        </Container>
    </>
} );
