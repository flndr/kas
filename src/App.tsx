import styled                   from '@emotion/styled';
import { Abruf }                from 'Components/Abruf';
import { Abwesenheiten }        from 'Components/Abwesenheiten';
import { Zusammenfassung }      from 'Components/Zusammenfassung';
import { startOfMonth }         from 'date-fns';
import { useEffect }            from 'react';
import React                    from 'react';
import { observer }             from 'mobx-react';
import { Divider }              from 'rsuite';
import { InputNumber }          from 'rsuite';
import { Stack }                from 'rsuite';
import { DatePickerProps }      from 'rsuite';
import { DateRangePickerProps } from 'rsuite';
import { DateRangePicker }      from 'rsuite';
import { DatePicker }           from 'rsuite';
import { DateRange }            from 'rsuite/DateRangePicker';
import { CalculatorStore }      from 'Stores/CalculatorStore';

import { useCalculatorStore }      from 'Stores/CalculatorStore';
import { CalculatorStoreProvider } from 'Stores/CalculatorStore';
import { Arbeitszeiten }           from 'Components/Arbeitszeiten';
import { Calendar }                from 'Components/Calendar';

const Calendars = styled.div`
  display         : flex;
  flex-wrap       : wrap;
  justify-content : stretch;
  align-items     : flex-start;
  margin          : -1.5rem;

  & > div {
    width   : 50%;
    padding : 1.5rem;
  }
`;

const Layout = styled.div`
  display         : flex;
  justify-content : stretch;
  align-items     : flex-start;
`;

const Column = styled.div`
  padding : 2rem;

  & > * + * {
    margin-top : 1rem;
  }
`;

const Left = styled( Column )`
  padding : 2rem;
`;

const Right = styled( Column )`
  padding : 2rem;
`;

function App() {
    
    const calculator = useCalculatorStore();
    
    useEffect( () => {
        return () => calculator.stopStore();
    }, [] );
    
    
    return <>
        <CalculatorStoreProvider store={ calculator }>
            <Layout>
                <Left>
                    
                    <h1>KAP*</h1>
                    
                    <Divider/>
                    
                    <h4>Zusammenfassung</h4>
                    
                    <Zusammenfassung/>
                    
                    <Divider/>
                    
                    <h4>Kalendermonate ({ calculator.monate.length })</h4>
                    
                    <Calendars>
                        { calculator.monate.map( m => <Calendar key={ 'cal-' + m } start={ m }/> ) }
                    </Calendars>
                    
                    
                    <Divider/>
                    <h4>* Hinweise zur Nutzung des KAP - Kunden-Abruf-Planer</h4>
                    <p>Der Algorithmus geht davon aus, dass du möglichst viel Zeit Remote arbeiten willst und dabei
                        keine Über- oder Minusstunden machst.</p>
                    <p>Dein Remote-Kontingent (RZ) wird daher immer vor deinem Vor-Ort-Kontingent (SZ) verbaucht.</p>
                    <p>Sind alle Kontingente (RZ+SZ) ausgeschöpft wird auf extern (ISO) verbucht.</p>
                
                </Left>
                
                <Right>
                    
                    <h4>Abruf</h4>
                    <Abruf/>
                    <Divider/>
                    
                    <h4>Abwesenheiten</h4>
                    <Abwesenheiten/>
                    <Divider/>
    
                    <h4>Arbeitszeiten</h4>
                    <Arbeitszeiten/>
                    <Divider/>
                    
                
                </Right>
            </Layout>
        
        
        </CalculatorStoreProvider>
    </>;
}

export default observer( App );
