import styled                   from '@emotion/styled';
import CloseIcon                from '@rsuite/icons/Close';
import { Color }                from 'Color';
import { observer }             from 'mobx-react';
import React                    from 'react';
import { Divider }              from 'rsuite';
import { SelectPicker }         from 'rsuite';
import { Checkbox }             from 'rsuite';
import { DatePickerProps }      from 'rsuite';
import { DateRangePickerProps } from 'rsuite';
import { DatePicker }           from 'rsuite';
import { DateRangePicker }      from 'rsuite';
import { InputNumber }          from 'rsuite';
import { IconButton }           from 'rsuite';
import { DateRange }            from 'rsuite/DateRangePicker';
import { TerminTyp }            from 'Models/Enum/TerminTyp';
import { TerminStore }          from 'Models/TerminStore';
import { ColorDot }             from 'Components/ColorDot';
import { CalculatorStore }      from 'Stores/CalculatorStore';
import { useCalculatorStore }   from 'Stores/CalculatorStore';
import { BREAK }                from 'Styles/media';
import { toNumber }             from 'Util/toNumber';
import { twoDigit }             from 'Util/twoDigit';

const InputNumberStyled = styled( InputNumber )`
  & > input {
    padding-right : 0 !important;
  }
`;

const ListItem = styled.div`
  width            : 100%;
  display          : flex;
  flex-wrap        : nowrap;
  justify-content  : stretch;
  align-items      : center;
  border-radius    : 8px;
  border           : 1px solid rgb(255 38 0 / 25%);
  padding          : 0.5rem 0.75rem;
  background-color : rgb(255 38 0 / 5%);


  & + & {
    margin-top : 0.5rem;
  }
`;

const Col = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  align-items     : center;
  flex-shrink     : 0;
  flex-grow       : 0;
  justify-content : flex-start;
`;

const ColDot = styled( Col )`
  width : 20px;
`;

const ColTyp = styled( Col )`
  width : 95px;
`;

const ColText = styled( Col )`
  flex-shrink     : 1;
  flex-grow       : 1;
  justify-content : flex-start;
  padding         : 0 1rem;
`;

const ColRepeat = styled( Col )`
  width : 124px;
`;

const ColGanztag = styled( Col )`
  width : 36px;
`;

const ColTime = styled( Col )`
  width : 80px;
`;

const ColRemove = styled( Col )`
  width           : 48px;
  justify-content : flex-end;
`;

const AddContainer = styled.div`
  margin : 0.5rem 0;

  & > div {
    white-space : nowrap;
  }

  & > * + * {
    margin-top : 0.5rem;
  }

  ${ BREAK.S } {
    display         : flex;
    justify-content : space-between;
    align-items     : center;

    & > * + * {
      margin-top  : 0;
      margin-left : 1.5rem;
    }
  }

`;

export const Termine = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    // TODO limit start + end
    const disabledDate = ( date : Date | undefined ) =>
        date ? calculator.istFeiertagOderWE( date ) : false;
    
    const handleOk = ( value : DateRange | Date | null ) => {
        if ( !value ) {
            return;
        }
        if ( value instanceof Date ) {
            calculator.addTermin( TerminTyp.URLAUB, value );
        } else {
            calculator.addTermin( TerminTyp.URLAUB, value[ 0 ], value[ 1 ] );
        }
    };
    
    const pickerProps : Partial<DateRangePickerProps & DatePickerProps> = {
        cleanable       : false,
        isoWeek         : true,
        showWeekNumbers : false,
        placement       : 'bottomEnd',
        ranges          : [],
        onOk            : handleOk,
        block           : true,
        style           : { width : '100%' }
    };
    
    return <div>
        
        { calculator._termine.length === 0 && <div>
            keine Termine
        </div> }
        
        { calculator._termine.map( termin => {
            
            const ganztags = !termin.stunden;
            
            const stunden = termin.stunden || calculator.durchschnittleicheArbeitszeitProTag;
            
            const toggleGanztag = () => {
                const terminUpdate : Partial<TerminStore> = {
                    stunden : termin.stunden === undefined
                              ? calculator.durchschnittleicheArbeitszeitProTag
                              : undefined
                }
                calculator.updateTermin( termin.typ, termin.dateStringStart, terminUpdate );
            };
            
            const toggleRepeat = () => {
                const terminUpdate : Partial<TerminStore> = {
                    repeat : termin.repeat === undefined
                             ? true
                             : undefined
                }
                calculator.updateTermin( termin.typ, termin.dateStringStart, terminUpdate );
            };
            
            const changeStunden = ( value : string | number ) => {
                calculator.updateTermin( termin.typ, termin.dateStringStart, { stunden : toNumber( value ) } );
            };
            
            return <ListItem key={ [ 'termin', termin.typ, termin.dateStringStart ].join( '-' ) }>
                <ColDot>
                    <ColorDot color={ Color[ termin.typ ] }/>
                </ColDot>
                <ColTyp>
                    <SelectPicker
                        style={ { width : '100%' } }
                        block={ true }
                        cleanable={ false }
                        searchable={ false }
                        size={ 'sm' }
                        onChange={ value => calculator.updateTermin( termin.typ, termin.dateStringStart, { typ : value } ) }
                        value={ termin.typ }
                        data={ [
                            { label : 'URLAUB', value : TerminTyp.URLAUB },
                            { label : 'VORORT', value : TerminTyp.VORORT },
                            { label : 'EXTERN', value : TerminTyp.EXTERN },
                        ] }/>
                </ColTyp>
                <ColText>
                    { termin.dateStringStart }{ termin.dateStringEnde ? ' bis ' + termin.dateStringEnde : '' }
                </ColText>
                <ColRepeat>
                    <Checkbox
                        onChange={ toggleRepeat }
                        disabled={ termin.typ !== TerminTyp.EXTERN || !!termin.dateStringEnde }
                        checked={ !!termin.repeat }>
                        wöchentl
                    </Checkbox>
                </ColRepeat>
                <ColGanztag>
                    <Checkbox
                        onChange={ toggleGanztag }
                        disabled={ termin.typ !== TerminTyp.EXTERN }
                        checked={ !ganztags }>
                    </Checkbox>
                </ColGanztag>
                <ColTime>
                    <InputNumberStyled
                        disabled={ ganztags }
                        buttonAppearance={ 'subtle' }
                        size={ 'sm' }
                        step={ 0.25 }
                        value={ twoDigit( stunden ) }
                        onChange={ changeStunden }
                        placeholder={ 'h' }/>
                </ColTime>
                <ColRemove>
                    <IconButton
                        size="xs"
                        onClick={ () => calculator.removeTermin( termin.typ, termin.dateStringStart ) }
                        icon={ <CloseIcon/> }/>
                </ColRemove>
            </ListItem>
        } ) }
        
        <Divider/>
        
        <AddContainer>
            <div>Termine hinzufügen:</div>
            <DateRangePicker
                { ...pickerProps }
                placeholder={ 'Zeitspanne wählen...' }
            />
            <div>oder</div>
            <DatePicker
                { ...pickerProps }
                disabledDate={ disabledDate }
                placeholder={ 'Tag wählen...' }
            />
        </AddContainer>
    
    </div>
} );
