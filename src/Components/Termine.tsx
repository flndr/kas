import styled                   from '@emotion/styled';
import CloseIcon                from '@rsuite/icons/Close';
import { Color }                from 'Color';
import { Nw }                   from 'Components/Zusammenfassung/Styles';
import { format }               from 'date-fns';
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
import { media }                from 'Styles/media';
import { stringToDate }         from 'Util/date';
import { toNumber }             from 'Util/toNumber';
import { twoDigit }             from 'Util/twoDigit';

const BREAK_TERMIN = 620;
const BREAK_DATE   = 500;
const BREAK_ADD    = 740;

const InputNumberStyled = styled( InputNumber )`
  & > input {
    padding-right : 0 !important;
  }
`;

const Container = styled.div`
  height          : 100%;
  display         : flex;
  flex-direction  : column;
  justify-content : space-between;
`;

const KeinTermine = styled.div`
  align-self  : stretch;
  display     : flex;
  align-items : center;
`;

const ListItem = styled.div`
  width           : 100%;
  display         : flex;
  flex-wrap       : wrap;
  justify-content : space-between;
  align-items     : center;
  border-radius   : 8px;
  border          : 1px solid rgba(66, 66, 66, 0.25);
  padding         : 0.5rem 0.75rem;
  min-height      : 56px;

  & + & {
    margin-top : 0.5rem;
  }

  ${ media( BREAK_TERMIN ) } {
    flex-wrap : nowrap;
  }
`;

const Col = styled.div`
`;

const ColDot = styled( Col )`
  display         : flex;
  justify-content : center;
  align-items     : center;
  margin-right    : 0.75rem;
`;

const ColTyp = styled( Col )`
  width : 95px;
`;

const ColText = styled( Col )`
  flex-shrink     : 1;
  flex-grow       : 1;
  justify-content : flex-start;
  padding         : 0 1rem;


  ${ media( BREAK_DATE ) } {
    br {
      display : none;
    }

    span {
      margin-right : 0.75rem;
    }
  }
`;

const ColRepeat = styled( Col )`
  width : 136px;
`;

const ColTime = styled( Col )`
  display         : flex;
  justify-content : space-between;
  align-items     : center;

  .rs-input-number {
    width : 80px;
  }
`;

const ColRemove = styled( Col )`
  ${ media( BREAK_TERMIN ) } {
    order : 2;
  }
`;

const ColOptions = styled( Col )`
  display         : flex;
  justify-content : flex-end;
  align-items     : center;
  border-top      : 1px solid rgba(66, 66, 66, 0.25);
  padding-top     : 0.5rem;
  margin-top      : 0.5rem;
  width           : 100%;

  ${ media( BREAK_TERMIN ) } {
    width        : auto;
    border-top   : 0;
    padding-top  : 0;
    margin-top   : 0;
    order        : 1;
    margin-right : 0.75rem;
  }

`;

const AddContainer = styled.div`
  margin : 2rem 0 0.5rem 0;

  & > div {
    white-space : nowrap;
  }

  & > * + * {
    margin-top : 0.5rem;
  }

  ${ media( BREAK_ADD ) } {
    display         : flex;
    justify-content : space-between;
    align-items     : center;

    & > * + * {
      margin-top  : 0;
      margin-left : 1.5rem;
    }
  }

`;

const readableDate = ( d : string ) => format( stringToDate( d ), 'dd.MM.yyyy' );

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
    
    return <Container>
        
        <div>
            
            <h4>Termine & Urlaub</h4>
            
            
            { calculator._termine.map( termin => {
                
                const stunden = termin.stunden || calculator.durchschnittleicheArbeitszeitProTag;
                
                const canEdit = !termin.dateStringEnde;
                
                const canEditTime     = !termin.stunden;
                const canToggleWeekly = termin.typ === TerminTyp.EXTERN && !termin.dateStringEnde;
                
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
                        <Nw>{ readableDate( termin.dateStringStart ) }</Nw>
                        { termin.dateStringEnde && <>
                            <br/><span>bis</span>
                            <Nw>{ readableDate( termin.dateStringEnde ) }</Nw>
                        </> }
                    </ColText>
                    <ColRemove>
                        <IconButton
                            size="xs"
                            onClick={ () => calculator.removeTermin( termin.typ, termin.dateStringStart ) }
                            icon={ <CloseIcon/> }/>
                    </ColRemove>
                    { canEdit && <ColOptions>
                        <ColRepeat>
                            <Checkbox
                                onChange={ toggleRepeat }
                                checked={ !!termin.repeat }>
                                wöchentlich
                            </Checkbox>
                        </ColRepeat>
                        <ColTime>
                            <Checkbox
                                onChange={ toggleGanztag }
                                checked={ !canEditTime }>
                            </Checkbox>
                            <InputNumberStyled
                                disabled={ canEditTime }
                                buttonAppearance={ 'subtle' }
                                size={ 'sm' }
                                step={ 0.25 }
                                value={ twoDigit( stunden ) }
                                onChange={ changeStunden }
                                placeholder={ 'h' }/>
                        </ColTime>
                    </ColOptions> }
                </ListItem>
            } ) }
        
        </div>
        
        { calculator._termine.length === 0 && <KeinTermine>
            Noch keine Termine angelegt...
        </KeinTermine> }
        
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
    
    </Container>
} );
