import React        from 'react';
import styled       from '@emotion/styled';
import { observer } from 'mobx-react';
import { twoDigit } from 'Util/twoDigit';
import { Tag }      from 'Models/Tag';
import { BREAK }    from 'Styles/media';
import { Color }    from 'Color';

const Container = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : stretch;
  font-size       : 10px;
  line-height     : 15px;
  border-radius   : 4px;
  overflow        : hidden;

  & > div {
    min-width  : 6px;
    min-height : 6px;
  }

  & > div > span {
    display : none;
  }

  ${ BREAK.S } {
    & > div {
      min-width  : 28px;
      min-height : 15px;
    }

    & > div > span {
      display : block;
    }
  }

`

interface ChildProps {
    percent : number;
}

const Bar = styled.div<ChildProps>`
  flex-grow   : 1;
  flex-shrink : 1;
  color       : white;
  width       : ${ p => p.percent }%;
  display     : ${ p => p.percent === 0 ? 'none' : 'block' };
  text-align  : center;
`;

const FreiBar = styled( Bar )`
  background-color : ${ Color.URLAUB };
`;

const RzBar = styled( Bar )`
  background-color : ${ Color.REMOTE };
`;

const IsoBar = styled( Bar )`
  background-color : ${ Color.EXTERN };
`;

const SzBar = styled( Bar )`
  background-color : ${ Color.VORORT };
`;

interface TimeBarProps {
    tag : Tag;
}

export const TimeBar = observer( ( props : TimeBarProps ) => {
    
    const tag = props.tag;
    
    if ( tag.istUrlaubstag ) {
        return <Container>
            <FreiBar percent={ 100 }><span>{ twoDigit( tag.stundenUrlaub ) }</span></FreiBar>
        </Container>;
    }
    
    if ( tag.istExternGanztaegig ) {
        return <Container>
            <IsoBar percent={ 100 }><span>{ twoDigit( tag.stundenExternGeplant ) }</span></IsoBar>
        </Container>;
    }
    
    const p = ( amount : number ) => tag.stundenZuArbeiten / 100 * amount * 100;
    
    let rz  = tag.stundenRemote;
    let sz  = tag.stundenVorOrtRest + tag.stundenVorOrtGeplant;
    let iso = tag.stundenExternGeplant + tag.stundenExternRest;
    
    return <Container>
        <RzBar percent={ p( rz ) }><span>{ twoDigit( rz ) }</span></RzBar>
        <SzBar percent={ p( sz ) }><span>{ twoDigit( sz ) }</span></SzBar>
        <IsoBar percent={ p( iso ) }><span>{ twoDigit( iso ) }</span></IsoBar>
    </Container>
} );
