import React                   from 'react';
import styled                  from '@emotion/styled';
import { InputNumber }         from 'rsuite';
import { observer }            from 'mobx-react';
import { useReststundenStore } from 'Stores/ReststundenStore';
import { Wochentag }           from 'Models/Wochentag';

const Zeile = styled.div`
  display         : flex;
  justify-content : flex-start;
  align-items     : center;
  
  & + & {
    margin-top: 6px;
  }
`;

const Label = styled.div`
  width : 6rem;
`;

const InputNumberStyled = styled( InputNumber )`
  width : 5rem;
`;

const Gesamt = styled.div`
  padding : 8px 12px;
`;

export const Arbeitszeiten = observer( () => {
    
    const reststundenStore = useReststundenStore();
    
    return <>
        { Object.keys( Wochentag ).map( w => {
            const key = w as keyof typeof Wochentag;
            return <Zeile key={ w }>
                <Label>{ w }</Label>
                <InputNumberStyled
                    step={ 0.25 }
                    value={ reststundenStore.getArbeitszeit( Wochentag[ key ] ) }
                    onChange={ value => reststundenStore.setArbeitszeit( Wochentag[ key ], value ) }
                    placeholder={ w }/>
            </Zeile>
        } ) }
        <Zeile>
            <Label>pro Woche</Label>
            <Gesamt>{ reststundenStore.arbeitszeitProWoche }</Gesamt>
        </Zeile>
    
        <Zeile>
            <Label>pro Tag</Label>
            <Gesamt>{ reststundenStore.arbeitszeitProTag }</Gesamt>
        </Zeile>
    
    </>
} );
