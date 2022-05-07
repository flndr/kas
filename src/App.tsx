import styled                   from '@emotion/styled';
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
    
    const disabledDate = ( date : Date | undefined ) =>
        date ? calculator.istFeiertagOderWE( date ) : false;
    
    const handleDateChange = ( value : DateRange | Date | null ) => {
        if ( !value ) {
            return;
        }
        if ( value instanceof Date ) {
            console.log( 'tag', value );
        } else {
            console.log( 'spanne', value[ 0 ], value[ 1 ] );
        }
    };
    
    const handleOk = ( value : DateRange | Date | null ) => {
        if ( !value ) {
            return;
        }
        if ( value instanceof Date ) {
            calculator.addKeinRemote( value );
        } else {
            calculator.addKeinRemote( value[ 0 ], value[ 1 ] );
        }
    };
    
    const pickerProps : Partial<DateRangePickerProps & DatePickerProps> = {
        cleanable       : false,
        isoWeek         : true,
        showWeekNumbers : false,
        placement       : 'bottomEnd',
        ranges          : [],
        onChange        : handleDateChange,
        onSelect        : handleDateChange,
        onOk            : handleOk,
        block           : true
    };
    
    return <>
        <CalculatorStoreProvider store={ calculator }>
            <Layout>
                <Left>
                    
                    <h1>KAP *</h1>
                    
                    <Divider/>
                    
                    <h4>Zusammenfassung</h4>
                    
                    <Zusammenfassung/>
                    
                    <Divider/>
                    
                    <h4>Kalendermonate ({ calculator.monate.length })</h4>
                    
                    <Calendars>
                        { calculator.monate.map( m => <Calendar key={ 'cal-' + m } start={ m }/> ) }
                    </Calendars>
                    
                    
                    <h4>Setup</h4>
                    <p>Ausgehend vom heutigen Tag</p>
                    <Stack spacing={ 20 }>
                        <div>
                            <label>Reststunden Ressource</label>
                            <InputNumber
                                style={ { width : '14rem' } }
                                step={ 0.25 }
                                value={ calculator.reststundenRZ }
                                onChange={ value => calculator.setReststundenRZ( value ) }
                                placeholder={ 'Reststunden RZ' }/>
                        </div>
                        <div>
                            <label>Letzter Tag Abruf</label>
                            <DatePicker
                                block={ true }
                                isoWeek={ true }
                                cleanable={ false }
                                showWeekNumbers={ true }
                                ranges={ [] }
                                value={ calculator.letzterTagAbruf }
                                onChange={ value => calculator.setLetzterTagAbruf( value ) }
                                placeholder={ 'Letzter Tag Abruf' }/>
                        </div>
                    </Stack>
                    
                    <Divider/>
                    <Stack>
                        {/*<div>buchungProTag: { fixed( calculator.buchungProTag ) }</div>*/ }
                        {/*<div>*/ }
                        {/*    <p>Bis Ablauf-Ende</p>*/ }
                        {/*    <pre>stundenBisAbrufEnde: { calculator.stundenBisAbrufEnde }</pre>*/ }
                        {/*    <pre>stundenAbwesenheitBisAbrufEnde: { calculator.stundenAbwesenheitBisAbrufEnde }</pre>*/ }
                        {/*    <pre>stundenGearbeitetBisAbrufEnde: { calculator.stundenGearbeitetBisAbrufEnde }</pre>*/ }
                        {/*</div>*/ }
                    </Stack>
                    
                    <Divider/>
                    <h4>* Hinweise zur Nutzung des KAP - Kunden-Abruf-Planer</h4>
                    <p>Der Algorithmus geht davon aus, dass du möglichst viel Zeit Remote arbeiten willst und dabei
                        keine Über- oder Minusstunden machst.</p>
                    <p>Dein Remote-Kontingent (RZ) wird daher immer vor deinem Vor-Ort-Kontingent (SZ) verbaucht.</p>
                    <p>Sind alle Kontingente (RZ+SZ) ausgeschöpft wird auf extern (ISO) verbucht.</p>

                </Left>
                
                <Right>
                    
                    <h4>Arbeitszeiten</h4>
                    
                    <Arbeitszeiten/>
                    
                    <Divider/>
                    
                    <h4>Abwesenheiten</h4>
                    
                    <Abwesenheiten/>
                    
                    <DateRangePicker
                        { ...pickerProps }
                        placeholder={ 'Zeitspanne wählen...' }
                    />
                    <DatePicker
                        { ...pickerProps }
                        disabledDate={ disabledDate }
                        placeholder={ 'Tag wählen...' }
                    />
                
                
                </Right>
            </Layout>
        
        
        </CalculatorStoreProvider>
    </>;
}

export default observer( App );
