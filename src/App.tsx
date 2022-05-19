import { useEffect }               from 'react';
import { observer }                from 'mobx-react';
import React                       from 'react';
import { Divider }                 from 'rsuite';
import styled                      from '@emotion/styled';
import CodeIcon                    from '@rsuite/icons/Code';
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
import { media }                   from 'Styles/media';
import { BREAK }                   from 'Styles/media';

const Wrapper = styled.div`
  padding   : 0.5rem;
  max-width : 1600px;
  margin    : 0 auto;

  h1 {
    font-size     : 46px;
    line-height   : 46px;
    margin-bottom : 0;
  }


  ${ BREAK.S } {
    padding : 1rem;
  }

  ${ BREAK.L } {
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

  h4 {
    margin : 0 0 1rem 0;
  }

  & > div + div {
    margin-top : 1rem;
  }

  ${ BREAK.L } {
    margin : 0 -1rem;

    & > div {
      width   : 50%;
      padding : 1rem;
    }
    
    & > div + div {
      margin-top : 0;
    }
  }

  ${ BREAK.XL } {
    & > div {
      width : 33.33%;
    }
  }
`;

const BREAK_DEINS = media( 1000 );

const Deins = styled.div`
  ${ BREAK_DEINS } {
    display         : flex;
    justify-content : space-between;
    align-items     : stretch;
  }
`;

const DeinSetup = styled.div`
  margin-top  : 2rem;
  border-top  : 1px solid var(--rs-divider-border);
  padding-top : 2rem;

  & > div + div {
    margin-top : 2rem;
  }

  ${ media( 500 ) } {
    display         : flex;
    justify-content : space-between;


    & > div {
      width : 46%;
    }

    & > div + div {
      margin-top : 0;
    }
  }

  ${ BREAK_DEINS } {
    display     : block;
    width       : 16rem;
    flex-grow   : 0;
    flex-shrink : 0;
    margin-top  : 0;
    border-top  : 0;
    padding-top : 0;

    & > div {
      width : 100%;
    }

    & > div + div {
      margin-top : 2rem;
    }
  }
`;

const DeineTermine = styled.div`
  ${ BREAK_DEINS } {
    width         : auto;
    flex-grow     : 1;
    padding-right : 4rem;
  }
`;

const Header = styled.div`
  display         : flex;
  justify-content : space-between;
  align-items     : center;

  a {
    font-size  : 2rem;
    opacity    : 0.3;
    transition : opacity 500ms ease-in-out;

    &:hover {
      opacity : 0.8;
    }
  }
`;

function App() {
    
    const calculator = useCalculatorStore();
    
    useEffect( () => {
        return () => calculator.stopStore();
    }, [] );
    
    return <>
        <CalculatorStoreProvider store={ calculator }>
            
            <Wrapper>
                
                <Header>
                    <h1> KAP* </h1>
                    <a title={ 'Code on GitHub' } href={ 'https://github.com/flndr/kas' }>
                        <CodeIcon/>
                    </a>
                </Header>
                
                <Divider/>
                
                <Deins>
                    <DeineTermine>
                        <Termine/>
                    </DeineTermine>
                    <DeinSetup>
                        <div>
                            <h4>Reststunden</h4>
                            <Abruf/>
                        </div>
                        <div>
                            <h4>Arbeitszeiten</h4>
                            <Arbeitszeiten/>
                        </div>
                    </DeinSetup>
                </Deins>
                
                <Divider/>
                
                <Stat></Stat>
                
                <Divider/>
                
                <SplitLayout
                    splitOn={ 1190 }
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
