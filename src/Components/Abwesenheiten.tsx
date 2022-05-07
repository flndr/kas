import styled          from '@emotion/styled';
import { Wochentag }   from 'Models/Enum/Wochentag';
import React           from 'react';
import { observer }    from 'mobx-react';
import { InputNumber } from 'rsuite';
import { IconButton }  from 'rsuite';
import CloseIcon       from '@rsuite/icons/Close';

import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';
import { twoDigit }           from 'Util/twoDigit';

interface Props {
}

const InputNumberStyled = styled( InputNumber )`
  width : 70px;

  & > input {
    padding-right : 0 !important;
  }
`;

const Line = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : space-between;
  align-items     : center;

  & + & {
    margin-top : 0.5rem;
  }

`;

export const Abwesenheiten = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    return <div>
        { calculator.keinRemote.length === 0 && <div>
            keine Abwesenheiten
        </div> }
        
        { calculator.keinRemote.map( kr => {
            
            const value = calculator.getStundenProTag( CalculatorStore.stringToDate( kr.dateString ) );
            
            return <Line key={ 'kr-' + kr.dateString }>
                <div>{ kr.dateString }</div>
                <InputNumberStyled
                    buttonAppearance={ 'subtle' }
                    size={ 'sm' }
                    step={ 0.25 }
                    value={ twoDigit( value ) }
                    //onChange={ value => calculator.setArbeitszeit( Wochentag[ key ], value ) }
                    placeholder={ 'h' }/>
                <IconButton
                    size="xs"
                    onClick={ () => calculator.removeKeinRemote( kr.dateString ) }
                    icon={ <CloseIcon/> }/>
            </Line>
        } ) }
    </div>
} );
