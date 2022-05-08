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
`;

const Hr = styled.div`
  overflow         : hidden;
  height           : 1px;
  margin           : 0.5rem 0;
  background-color : grey;
  opacity          : 0.5;
`;

const Pre = styled.pre`
  font-family : inherit;
  display     : block;
  overflow    : visible;
  margin      : 0;
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
    
    const stundenRemote = calculator.zusammenfassung.tage
                                    .map( t => t.stundenRemote )
                                    .reduce( ( prev, cur ) => prev + cur, 0 );
    
    return <>
        {/*<div>stundenZuArbeiten: { stundenZuArbeiten }</div>*/ }
        {/*<div>stundenGearbeitet: { stundenGearbeitet }</div>*/ }
        {/*<div>stundenUrlaub: { stundenUrlaub }</div>*/ }
        {/*<div>stundenRemote: { stundenRemote }</div>*/ }
        
        
        <h4>Abruf</h4>
        <Line>
            <Pre>Abruf gesamt</Pre>
            <Zeiten z={ calculator.abrufZeitenGesamt }/>
        </Line>
        
        <Line>
            <Pre>- davon geplant vor Ort (SZ)</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitVorOrtGeplant }/>
        </Line>
        <Hr/>
        <Line>
            <Pre>= Rest</Pre>
            <Zeiten z={ calculator.abgerufenRestZeiten }/>
        </Line>
        <Line>
            <Pre>- davon Remote (RZ)</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitRemote }/>
        </Line>
        <Line>
            <Pre>- davon vor Ort (SZ)</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitVorOrtRest }/>
        </Line>
        <Hr/>
        <Line>
            <Pre>= Reststunden</Pre>
            <Zeiten z={ calculator.saldoAbruf }/>
        </Line>
        
        
        <h4>Reststunden</h4>
        <Line>
            <Pre>Gesamt-Zeit bis Abruf-Ende</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitGesamt }/>
        </Line>
        <Line>
            <Pre>- davon Feiertage/WE</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitFeierOderWE }/>
        </Line>
        <Line>
            <Pre>- davon Urlaub</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitUrlaub }/>
        </Line>
        <Hr/>
        <Line>
            <Pre>= Zeit zu Arbeiten</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitZuArbeiten }/>
        </Line>
        <Line>
            <Pre>- davon abgerufen (RZ+SR)</Pre>
            <Zeiten z={ calculator.abgerufenZeiten }/>
        </Line>
        <Line>
            <Pre>- davon geplant extern (ISO)</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitExternGeplant }/>
        </Line>
        <Hr/>
        <Line>
            <Pre>= Saldo</Pre>
            <Zeiten z={ calculator.saldoReststunden }/>
        </Line>
    
    </>
    
} );
