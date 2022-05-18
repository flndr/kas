import React                  from 'react';
import { observer }           from 'mobx-react';
import { Color }              from 'Color';
import { Zeiten }             from 'Components/Zeiten';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';
import { Hr }                 from './Styles';
import { Dot, Nw, Op, Pre }   from './Styles';
import { Line }               from './Styles';

export const Reststunden = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    return <div>
        <Line>
            <Pre left>Gesamt-Zeit bis Abruf-Ende</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitGesamt }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon Feiertage/WE</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitFeierOderWE }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon frei <Nw>(<Dot color={ Color.URLAUB }/>URLAUB)</Nw></Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitUrlaub }/>
        </Line>
        <Hr/>
        <Line>
            <Pre><Op>=</Op>Zeit zu Arbeiten</Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitZuArbeiten }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon abgerufen <Nw>(<Dot color={ Color.REMOTE }/>RZ+<Dot
                color={ Color.VORORT }/>SZ)</Nw></Pre>
            <Zeiten z={ calculator.abgerufenZeiten }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon geplant extern <Nw>(<Dot color={ Color.EXTERN }/>ISO)</Nw></Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitExternGeplant }/>
        </Line>
        <Hr/>
        <Line>
            <Pre><Op>=</Op>Saldo</Pre>
            <Zeiten z={ calculator.saldoReststunden }/>
        </Line>
    </div>
    
} );
