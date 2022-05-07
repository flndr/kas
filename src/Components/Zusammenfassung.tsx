import { Zeiten }   from 'Components/Zeiten';
import React        from 'react';
import { observer } from 'mobx-react';
import { format }   from 'date-fns';
import { de }       from 'date-fns/locale';
import styled       from '@emotion/styled';
import CheckIcon    from '@rsuite/icons/Check';

import { TimeBar }            from 'Components/TimeBar';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';

const Container = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : stretch;
`;

const Column = styled.div`
`;

const Left = styled( Column )`
  padding-right : 2rem;
`;

const Right = styled( Column )`
`;

const Box = styled.div`
  flex-grow     : 1;
  width         : ${ 100 / 8 }%;
  padding       : 4px;
  margin        : 2px;
  overflow      : hidden;
  border-radius : 6px;
  cursor        : default;
  text-align    : center;
  color         : var(--rs-border-primary);
`;

const BoxRZ = styled( Box )`
  color  : var(--rs-text-primary);
  border : 1px solid var(--rs-border-primary);
`;

const Line = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : space-between;
  align-items     : center;

  & + & {
    margin-top : 0.25rem;
  }

  & > *:first-of-type {
    margin-right : 2rem;
  }

`;

const Hr = styled.div`
  overflow         : hidden;
  height           : 1px;
  margin           : 0.5rem 0;
  background-color : grey;
  opacity          : 0.5;
`;

interface Props {
}

export const Zusammenfassung = observer( ( props : Props ) => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    const stundenZuArbeiten = calculator.zusammenfassung.tage
                          .map( t => t.stundenZuArbeiten )
                          .reduce( ( prev, cur ) => prev + cur, 0 );
    
    const stundenUrlaub = calculator.zusammenfassung.tage
                          .map( t => t.stundenUrlaub )
                          .reduce( ( prev, cur ) => prev + cur, 0 );
    
    const stundenGearbeitet = calculator.zusammenfassung.tage
                          .map( t => t.stundenGearbeitet )
                          .reduce( ( prev, cur ) => prev + cur, 0 );
    
    return <>
        <div>stundenZuArbeiten: {stundenZuArbeiten}</div>
        <div>stundenGearbeitet: {stundenGearbeitet}</div>
        <div>stundenUrlaub: {stundenUrlaub}</div>
        <Container>
            <Left>
                <Line><span>Zeit bis Abruf-Ende</span><Zeiten z={ calculator.zusammenfassung.zeitGesamt }/></Line>
                <Line><span> - davon Feiertage/WE</span><Zeiten
                    z={ calculator.zusammenfassung.zeitFeierOderWE }/></Line>
                <Line><span> - davon Urlaub</span><Zeiten z={ calculator.zusammenfassung.zeitUrlaub }/></Line>
                <Hr/>
                <Line><span> = Zeit zu Arbeiten</span><Zeiten z={ calculator.zusammenfassung.zeitZuArbeiten }/></Line>
                <Line><span> - davon geplant vor Ort (SZ)</span><Zeiten
                    z={ calculator.zusammenfassung.zeitVorOrtRest }/></Line>
                <Line><span> - davon geplant extern (ISO)</span><Zeiten
                    z={ calculator.zusammenfassung.zeitExternGeplant }/></Line>
                <Hr/>
                <Line><span> = RZ benötigt</span><Zeiten z={ calculator.zusammenfassung.zeitRemote }/></Line>
                <Line><span> - RZ verfügbar</span><Zeiten z={ {
                    tage    : calculator.reststundenRZ / calculator.durchschnittleicheArbeitszeitProTag,
                    stunden : calculator.reststundenRZ
                } }/></Line>
                <Hr/>
                <Line><span>RZ saldo</span><Zeiten z={ { tage : 0, stunden : 0 } }/></Line>
            </Left>
            <Right>
                <BoxRZ>
                    <CheckIcon/>
                </BoxRZ>
            </Right>
        
        </Container>
    </>
} );
