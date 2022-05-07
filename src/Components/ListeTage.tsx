import styled       from '@emotion/styled';
import React        from 'react';
import { observer } from 'mobx-react';

import { Tag }                from 'Models/Tag';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';

const Container = styled.div`
  display   : flex;
  flex-wrap : wrap;
`;

const Day = styled.div`
  flex-grow     : 0;
  flex-shrink   : 0;
  width         : 6rem;
  height        : 6rem;
  padding       : 4px 6px;
  margin        : 2px;
  overflow      : hidden;
  border-radius : 6px;
  cursor        : default;
  color         : var(--rs-text-primary);
  border        : 1px solid var(--rs-border-primary);
`;

interface Props {
}

export const ListeTage = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    return <>
        <Container>
            { calculator.tage.map( ( tag : Tag ) => {
                return <Day key={ 'tag-' + tag.dateString }>
                    { tag.dateString } -
                    { tag.istArbeitstag ? 'Arbeitstag' : 'FeiertagOderWE' } -
                    
                    { tag.stundenZuArbeiten } -
                    { tag.stundenGearbeitet }
                </Day>
            } ) }
        </Container>
    </>
} );
