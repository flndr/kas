import { useEffect }               from 'react';
import { observer }                from 'mobx-react';
import React                       from 'react';
import { Divider }                 from 'rsuite';
import styled                      from '@emotion/styled';
import { Abruf }                   from 'Components/Abruf';
import { Hinweise }                from 'Components/Hinweise';
import { SplitLayout }             from 'Components/Shared/SplitLayout';
import { Stat }                    from 'Components/Shared/Stat';
import { Termine }                 from 'Components/Termine';
import { Reststunden }             from 'Components/Zusammenfassung/Reststunden';
import { Abruf as AbrufZusammen }  from 'Components/Zusammenfassung/Abruf';
import { useCalculatorStore }      from 'Stores/CalculatorStore';
import { CalculatorStoreProvider } from 'Stores/CalculatorStore';
import { Arbeitszeiten }           from 'Components/Arbeitszeiten';
import { Calendar }                from 'Components/Calendar';
import { BREAK }                   from 'Styles/media';

const Wrapper = styled.div`
  padding : 0.5rem;

  ${ BREAK.S } {
    padding : 1rem;
  }

  ${ BREAK.XL } {
    padding : 2rem;
  }

`;

const Calendars = styled.div`
  display         : flex;
  flex-wrap       : wrap;
  justify-content : stretch;
  align-items     : flex-start;

  ${ BREAK.L } {
    margin : 0 -1rem;

    & > div {
      width   : 50%;
      padding : 1rem;
    }
  }

  ${ BREAK.XL } {
    & > div {
      width : 33.33%;
    }
  }
`;

const Deins = styled.div`
  display         : flex;
  justify-content : space-between;
  align-items     : flex-start;
`;

const DeinSetup = styled.div`
  width       : 16rem;
  flex-grow   : 0;
  flex-shrink : 0;
  
`;

const DeineTermine = styled.div`
  width     : auto;
  flex-grow : 1;
  //background-color : #0e8ce6;
  //--rs-input-bg    : #046ab2;
`;

function App() {
    
    const calculator = useCalculatorStore();
    
    useEffect( () => {
        return () => calculator.stopStore();
    }, [] );
    
    return <>
        <CalculatorStoreProvider store={ calculator }>
            
            <Wrapper>
                
                <h1>KAP*</h1>
                
                <Divider/>
                
                <Deins>
                    <DeineTermine>
                        <h4>Termine & Urlaub</h4>
                        <Termine/>
                    </DeineTermine>
                    <DeinSetup>
                        <h4>Reststunden</h4>
                        <Abruf/>
                        <h4>Arbeitszeiten</h4>
                        <Arbeitszeiten/>
                    </DeinSetup>
                </Deins>
                
                <Divider/>
                
                <Stat></Stat>
                
                <Divider/>
                
                <SplitLayout
                    splitOn={ BREAK.XL }
                    left={ <div>
                        <h4>Abruf</h4>
                        <AbrufZusammen/>
                    </div> }
                    right={ <div>
                        <h4>Reststunden</h4>
                        <Reststunden/>
                    </div> }
                ></SplitLayout>
                
                
                <Divider/>
                
                <Calendars>
                    { calculator.monate.map( m => <Calendar key={ 'cal-' + m } start={ m }/> ) }
                </Calendars>
                
                
                <Divider/>
                
                <h4>* Hinweise zur Nutzung des KAP - Kunden-Abruf-Planer</h4>
                
                <Hinweise/>
            
            </Wrapper>
        </CalculatorStoreProvider>
    </>;
}

export default observer( App );
