import React           from 'react';
import { DatePicker }  from 'rsuite';
import { InputNumber } from 'rsuite';
import { observer }    from 'mobx-react';
import styled          from '@emotion/styled';

import { useCalculatorStore } from 'Stores/CalculatorStore';

const Zeile = styled.div`
  display         : flex;
  justify-content : space-between;
  align-items     : center;

  & + & {
    margin-top : 6px;
  }
`;

const Label = styled.div`
  width       : 6rem;
  flex-grow   : 1;
  flex-shrink : 1;
`;

const InputNumberStyled = styled( InputNumber )`
  width : 4.75rem;

  & > input {
    padding-right : 0 !important;
  }
`;

export const Abruf = observer( () => {
    
    const calculator = useCalculatorStore();
    
    return <div>
        
        <Zeile>
            <Label>Reststunden RZ</Label>
            <InputNumberStyled
                step={ 0.25 }
                value={ calculator.reststundenRZ }
                onChange={ value => calculator.setReststundenRZ( value ) }
                placeholder={ 'Reststunden RZ' }/>
        </Zeile>
        
        <Zeile>
            <Label>Reststunden SZ</Label>
            <InputNumberStyled
                step={ 0.25 }
                value={ calculator.reststundenSZ }
                onChange={ value => calculator.setReststundenSZ( value ) }
                placeholder={ 'Reststunden SZ' }/>
        </Zeile>
        
        <Zeile>
            <Label>Start</Label>
            <DatePicker
                block={ true }
                isoWeek={ true }
                cleanable={ false }
                showWeekNumbers={ false }
                placement={ 'bottomEnd' }
                ranges={ [] }
                value={ calculator.ersterTagAbruf }
                onChange={ value => calculator.setErsterTagAbruf( value ) }
                placeholder={ 'Erster Tag' }/>
        </Zeile>
        
        <Zeile>
            <Label>Ende</Label>
            <DatePicker
                block={ true }
                isoWeek={ true }
                cleanable={ false }
                showWeekNumbers={ false }
                placement={ 'bottomEnd' }
                ranges={ [] }
                value={ calculator.letzterTagAbruf }
                onChange={ value => calculator.setLetzterTagAbruf( value ) }
                placeholder={ 'Letzter Tag' }/>
        </Zeile>
    
    </div>
} );
