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

function App() {
    
    const calculator = useCalculatorStore();
    
    useEffect( () => {
        return () => calculator.stopStore();
    }, [] );
    
    
    
    const disabledDate = ( date : Date | undefined ) =>
        date ? calculator.isFeiertagOderWE( date ) : false;
    
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
        showWeekNumbers : true,
        ranges          : [],
        onChange        : handleDateChange,
        onSelect        : handleDateChange,
        onOk            : handleOk
    };
    
    const ersterTagMonat = startOfMonth( CalculatorStore.stringToDate( calculator.tage[ 0 ].dateString ) );
    
    return <>
        <CalculatorStoreProvider store={ calculator }>
            <div>
                <h1>RZ-Exhauster</h1>
                
                <Divider/>
                
                <h3>Setup</h3>
                <p>Ausgehend vom heutigen Tag</p>
                <Stack spacing={ 20 }>
                    <div>
                        <label>Reststunden Ressource</label>
                        <InputNumber
                            style={ { width : '14rem' } }
                            step={ 0.25 }
                            value={ calculator.reststunden }
                            onChange={ value => calculator.setReststunden( value ) }
                            placeholder={ 'Reststunden Ressource' }/>
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
                
                {/*<Divider/>*/ }
                {/*<Stack>*/ }
                {/*    <div>buchungProTag: { fixed( calculator.buchungProTag ) }</div>*/ }
                {/*    <div>*/ }
                {/*        <p>Bis Ablauf-Ende</p>*/ }
                {/*        <pre>  Arbeitsstunden: { calculator.zeitZuArbeitenBisAblaufEnde } ({ calculator.zeitZuArbeitenBisAblaufEnde / calculator.arbeitszeitProTag } Tage)</pre>*/ }
                {/*        <pre>  - Abwesenheit: { calculator.zeitAbwesenheitBisAblaufEnde } ({ calculator.zeitAbwesenheitBisAblaufEnde / calculator.arbeitszeitProTag } Tage)</pre>*/ }
                {/*        <pre>verfügbare Arbeitszeit: { calculator.zeitAbzglAbwesenheitBisAblaufEnde } ({ calculator.zeitAbzglAbwesenheitBisAblaufEnde / calculator.arbeitszeitProTag } Tage)</pre>*/ }
                {/*    */ }
                {/*    </div>*/ }
                {/*</Stack>*/ }
                <Divider/>
                
                <h3>Urlaub/Abwesenheiten anlegen</h3>
                
                
                <DateRangePicker
                    { ...pickerProps }
                    placeholder={ 'Zeitspanne wählen...' }
                />
                <DatePicker
                    { ...pickerProps }
                    disabledDate={ disabledDate }
                    placeholder={ 'Tag wählen...' }
                />
                <Divider/>
                
                
                <Arbeitszeiten/>
                
                <h3>Tage</h3>
                <Calendar start={ ersterTagMonat }/>
            
            
            </div>
        </CalculatorStoreProvider>
    </>;
}

export default observer( App );
