import { Arbeitszeiten }        from 'Components/Arbeitszeiten';
import { ListeTage }            from 'Components/ListeTage';
import { observer }             from 'mobx-react';
import { useEffect }            from 'react';
import React                    from 'react';
import { Divider }              from 'rsuite';
import { InputNumber }          from 'rsuite';
import { Stack }                from 'rsuite';
import { DatePickerProps }      from 'rsuite';
import { DateRangePickerProps } from 'rsuite';
import { DateRangePicker }      from 'rsuite';
import { DatePicker }           from 'rsuite';
import { DateRange }            from 'rsuite/DateRangePicker';

import { useReststundenStore }      from 'Stores/ReststundenStore';
import { ReststundenStoreProvider } from 'Stores/ReststundenStore';

function App() {
    
    const reststundenStore = useReststundenStore();
    
    useEffect( () => {
        return () => reststundenStore.stopStore();
    }, [] );
    
    const fixed = ( value : number ) : string => value.toFixed( 2 );
    
    const disabledDate = ( date : Date | undefined ) =>
        date ? reststundenStore.isFeierOderWE( date ) : false;
    
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
            reststundenStore.addAbwesenheit( value );
        } else {
            console.log( 'etz?', value );
            reststundenStore.addAbwesenheit( value[ 0 ], value[ 1 ] );
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
    
    return <>
        <ReststundenStoreProvider store={ reststundenStore }>
            <div>
                <h1>Reststunden-Berechnung</h1>
                
                <Divider/>
                
                <h3>Setup</h3>
                <p>Ausgehend vom heutigen Tag</p>
                <Stack spacing={ 20 }>
                    <div>
                        <label>Reststunden Ressource</label>
                        <InputNumber
                            style={ { width : '14rem' } }
                            step={ 0.25 }
                            value={ reststundenStore.reststunden }
                            onChange={ value => reststundenStore.setReststunden( value ) }
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
                            value={ reststundenStore.letzterTagAbruf }
                            onChange={ value => reststundenStore.setLetzterTagAbruf( value ) }
                            placeholder={ 'Letzter Tag Abruf' }/>
                    </div>
                </Stack>
                
                <Divider/>
                <Stack>
                    <div>buchungProTag: { fixed( reststundenStore.buchungProTag ) }</div>
                    <div>
                        <p>Bis Ablauf-Ende</p>
                        <pre>  Arbeitsstunden: { reststundenStore.zeitZuArbeitenBisAblaufEnde } ({ reststundenStore.zeitZuArbeitenBisAblaufEnde / reststundenStore.arbeitszeitProTag } Tage)</pre>
                        <pre>  - Abwesenheit: { reststundenStore.zeitAbwesenheitBisAblaufEnde } ({ reststundenStore.zeitAbwesenheitBisAblaufEnde / reststundenStore.arbeitszeitProTag } Tage)</pre>
                        <pre>verfügbare Arbeitszeit: { reststundenStore.zeitAbzglAbwesenheitBisAblaufEnde } ({ reststundenStore.zeitAbzglAbwesenheitBisAblaufEnde / reststundenStore.arbeitszeitProTag } Tage)</pre>
                    
                    </div>
                </Stack>
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
                <ListeTage/>
            
            
            </div>
        </ReststundenStoreProvider>
    </>;
}

export default observer( App );
