import React                  from 'react';
import { observer }           from 'mobx-react';
import styled                 from '@emotion/styled';
import CheckIcon              from '@rsuite/icons/Check';
import CloseIcon              from '@rsuite/icons/Close';
import WaitIcon               from '@rsuite/icons/Wait';
import IdMappingIcon          from '@rsuite/icons/IdMapping';
import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';
import { media }              from 'Styles/media';
import { Nw }                 from 'Components/Zusammenfassung/Styles';

const BREAK = 850;

interface BoxColor {
    bg : string;
    font : string;
}

const colorNeutral : BoxColor = {
    bg   : '#27F5F5',
    font : '#038F8F'
}

const colorSuccess : BoxColor = {
    bg   : '#A3F527',
    font : '#038F03'
}

const colorWarning : BoxColor = {
    bg   : '#F59527',
    font : '#8F4203'
}

interface BoxProps {
    etz? : BoxColor;
}

const Box = styled.div<BoxProps>`
  display          : flex;
  flex-direction   : column;
  justify-content  : space-between;
  border-radius    : 8px;
  padding          : 1rem;
  border           : 4px solid ${ p => p.etz ? p.etz.font : colorNeutral.font };
  background-color : ${ p => p.etz ? p.etz.bg : colorNeutral.bg };
  color            : ${ p => p.etz ? p.etz.font : colorNeutral.font };
  height           : 100%;

  & > div {
    padding-right : 3rem;
  }

  & > h4 {
    position      : relative;
    padding-right : 3rem;
    margin-bottom : 1rem;

    svg {
      position : absolute;
      right    : 0.5rem;
      top      : 0.5rem;
      width    : 2rem;
      height   : 2rem;
    }

    br {
      display : none;

      ${ media( BREAK ) } {
        display : block;
      }
    }

  }


`;

const Container = styled.div`

  & > * + * {
    margin-top : 1rem;
  }

  ${ media( BREAK ) } {

    display         : flex;
    justify-content : stretch;
    align-items     : stretch;


    & > * {
      width : 33.33%;
    }

    & > * + * {
      margin-top  : 0;
      margin-left : 2rem;
    }
  }
`;

export const Stat = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    const restTage    = Math.round( calculator.saldoReststunden.tage );
    const restStunden = Math.round( calculator.saldoReststunden.stunden );
    const hatRest     = calculator.saldoReststunden.stunden > 0;
    
    const abrufReststunden      = calculator.saldoAbruf.stunden;
    const istAbrufAusgeschoepft = calculator.saldoAbruf.stunden === 0;
    
    const tageSZ = calculator.zusammenfassung.zeitVorOrtRest.tage +
                   calculator.zusammenfassung.zeitVorOrtGeplant.tage;
    
    const tageGesamt = calculator.zusammenfassung.zeitRemote.tage +
                       calculator.zusammenfassung.zeitVorOrtRest.tage +
                       calculator.zusammenfassung.zeitVorOrtGeplant.tage;
    
    const wochenGesamt = tageGesamt / 5;
    
    const tageSzProWoche = ( tageSZ / wochenGesamt ).toFixed( 1 );
    const tageSzProzent  = Math.round( 100 / tageGesamt * tageSZ );
    
    let BoxAbruf;
    if ( istAbrufAusgeschoepft ) {
        BoxAbruf = <Box etz={ colorSuccess }>
            <h4>
                Abruf komplett <br/>ausgeschöpft
                <CheckIcon/>
            </h4>
            <div>Du wirst alle verrechnungsfähigen Stunden aufbrauchen.</div>
        </Box>
    } else {
        BoxAbruf = <Box etz={ colorWarning }>
            <h4>
                Abruf nicht <br/>ausgeschöpft
                <CloseIcon/>
            </h4>
            <div>Du hast { abrufReststunden } Stunden übrig, die nicht verrechnet werden können.</div>
        </Box>
    }
    
    let BoxRest;
    if ( hatRest ) {
        BoxRest = <Box>
            <h4>
                { restTage } Rest-Tage <br/>nach Abruf
                <WaitIcon/>
            </h4>
            <div>Du sitzt nach dem Abruf <Nw>{ restStunden } Stunden</Nw> auf der Bank.</div>
        </Box>
    } else {
        BoxRest = <Box etz={ colorSuccess }>
            <h4>
                Gesamt-Zeit <br/>ausgeschöpft
                <CheckIcon/>
            </h4>
            <div>Du sitzt nicht auf der Bank zwischen den Abrufen.</div>
        </Box>
    }
    
    return <Container>
        <div>
            { BoxAbruf }
        </div>
        <div>
            { BoxRest }
        </div>
        <div>
            <Box>
                <h4>
                    <Nw>{ tageSzProWoche } Tage</Nw> <br/>VorOrt/Woche
                    <IdMappingIcon/>
                </h4>
                <div>entspricht { tageSzProzent }% VorOrt-Zeit im Abruf ohne Berücksichtung externer Termine.</div>
            </Box>
        </div>
    </Container>
} );

/*

Abruf ausgeschöpft
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';


Reststunden nach Abruf


Verhältnis Remote/VorOrt
Tage/Woche
import PieChartIcon from '@rsuite/icons/PieChart';

Alle Buchungen
import BarChartIcon from '@rsuite/icons/BarChart';


 */
