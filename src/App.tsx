import styled                   from '@emotion/styled';
import { Abruf }                from 'Components/Abruf';
import { Termine }              from 'Components/Termine';
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
  margin          : 0 -1rem;

  & > div {
    width   : 50%;
    padding : 1rem;
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

const TopLayout = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : stretch;
  align-items     : stretch;
`;

const TopCol  = styled.div`
`;
const TopLeft = styled( TopCol )`
  padding-right : 2rem;
  width         : 50%;
`;

const TopRight = styled( TopCol )`
  width : 50%;
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
                    
                    <TopLayout>
                        <TopLeft>
                           
                            <Zusammenfassung/>
                        </TopLeft>
                        <TopRight>
                            <h4>Termine & Urlaub</h4>
                            <Termine/>
                        </TopRight>
                    </TopLayout>
                    
                    
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
                    <p>Limitierungen</p>
                    <ul>
                        <li>Vor-Ort-Tage sind immer ganze Tage</li>
                        <li>Wochenenden werden ignoriert</li>
                        <li>Externe Zeiten könnten nur 1-wöchentlich wiederholt werden</li>
                    </ul>
                
                </Left>
                
                <Right>
                    
                    <h4>Abruf</h4>
                    <Abruf/>
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
