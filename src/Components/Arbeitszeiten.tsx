import React           from 'react';
import { InputNumber } from 'rsuite';
import { observer }    from 'mobx-react';
import styled          from '@emotion/styled';

import { useCalculatorStore } from 'Stores/CalculatorStore';
import { Wochentag }          from 'Models/Enum/Wochentag';
import { twoDigit }           from 'Util/twoDigit';

const Zeile = styled.div`
  display         : flex;
  justify-content : flex-start;
  align-items     : center;

  & + & {
    margin-top : 6px;
  }
`;

const Label = styled.div`
  width : 6rem;
`;

const InputNumberStyled = styled( InputNumber )`
  width : 4.75rem;

  & > input {
    padding-right : 0 !important;
  }
`;

const Gesamt = styled.div`
  padding : 8px 12px;
`;

export const Arbeitszeiten = observer( () => {
    
    const calculator = useCalculatorStore();
    
    return <>
        { Object.keys( Wochentag ).map( w => {
            const key = w as keyof typeof Wochentag;
            return <Zeile key={ w }>
                <Label>{ w }</Label>
                <InputNumberStyled
                    buttonAppearance={ 'subtle' }
                    size={ 'sm' }
                    step={ 0.25 }
                    value={ twoDigit(calculator.getArbeitszeit( Wochentag[ key ] ) ) }
                    onChange={ value => calculator.setArbeitszeit( Wochentag[ key ], value ) }
                    placeholder={ w }/>
            </Zeile>
        } ) }
        <Zeile>
            <Label>pro Woche</Label>
            <Gesamt>{ calculator.durchschnittleicheArbeitszeitProWoche }</Gesamt>
        </Zeile>
        
        <Zeile>
            <Label>pro Tag</Label>
            <Gesamt>{ calculator.durchschnittleicheArbeitszeitProTag }</Gesamt>
        </Zeile>
    
    </>
} );
