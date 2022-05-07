import styled            from '@emotion/styled';
import { KeinRemoteTyp } from 'Models/Enum/KeinRemoteTyp';
import React             from 'react';
import { observer }      from 'mobx-react';

import { Tag }      from 'Models/Tag';
import { twoDigit } from 'Util/twoDigit';

interface ContainerProps {
    showDigits : boolean;
}

const Container = styled.div<ContainerProps>`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : stretch;
  font-size       : 10px;
  line-height     : 15px;
  border-radius   : 4px;
  overflow        : hidden;

  & > div {
    min-width  : ${ p => p.showDigits ? 28 : 6 }px;
    min-height : ${ p => p.showDigits ? 15 : 6 }px;
  }

  & > div > span {
    display : ${ p => p.showDigits ? 'block' : 'none' };
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
  background-color : #7c7c7c;
`;

const RzBar = styled( Bar )`
  background-color : #0dd03f;
`;

const IsoBar = styled( Bar )`
  background-color : #00a9dc;
`;

const SzBar = styled( Bar )`
  background-color : #ff2600;
`;

interface TimeBarProps {
    tag : Tag;
}

export const TimeBar = observer( ( props : TimeBarProps ) => {
    
    const tag        = props.tag;
    const showDigits = true;
    
    let frei = 0;
    let rz   = tag.stundenRemote;
    let sz   = tag.stundenVorOrtRest;
    let iso  = tag.stundenExternGeplant;

    if(tag.istUrlaubstag) {
        frei = tag.stundenZuArbeiten;
        rz = 0;
        sz = 0;
        iso = 0;
    }


    
    const p = ( amount : number ) => tag.stundenZuArbeiten / 100 * amount * 100;
    
    return <Container showDigits={ showDigits }>
        <FreiBar percent={ p( frei ) }><span>{ twoDigit( frei ) }</span></FreiBar>
        <RzBar percent={ p( rz ) }><span>{ twoDigit( rz ) }</span></RzBar>
        <SzBar percent={ p( sz ) }><span>{ twoDigit( sz ) }</span></SzBar>
        <IsoBar percent={ p( iso ) }><span>{ twoDigit( iso ) }</span></IsoBar>
    </Container>
} );
