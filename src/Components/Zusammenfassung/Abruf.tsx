import React                  from 'react';
import { observer }           from 'mobx-react';
import { Color }              from 'Color';
import { Zeiten }             from 'Components/Zeiten';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';
import { Hr }                 from './Styles';
import { Dot, Nw, Op, Pre }   from './Styles';
import { Line }               from './Styles';

export const Abruf = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    return <div>
        <Line>
            <Pre left>Abruf gesamt</Pre>
            <Zeiten z={ calculator.abrufZeitenGesamt }/>
        </Line>
        
        <Line>
            <Pre><Op>-</Op>davon geplant vor Ort <Nw>(<Dot color={ Color.VORORT }/>SZ)</Nw></Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitVorOrtGeplant }/>
        </Line>
        <Hr/>
        <Line>
            <Pre><Op>=</Op>Rest</Pre>
            <Zeiten z={ calculator.abgerufenRestZeiten }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon Remote <Nw>(<Dot color={ Color.REMOTE }/>RZ)</Nw></Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitRemote }/>
        </Line>
        <Line>
            <Pre><Op>-</Op>davon vor Ort <Nw>(<Dot color={ Color.VORORT }/>SZ)</Nw></Pre>
            <Zeiten z={ calculator.zusammenfassung.zeitVorOrtRest }/>
        </Line>
        <Hr/>
        <Line>
            <Pre><Op>=</Op>Reststunden</Pre>
            <Zeiten z={ calculator.saldoAbruf }/>
        </Line>
    </div>
    
} );
