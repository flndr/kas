import styled        from '@emotion/styled';
import { Color }     from 'Color';
import { TerminTyp } from 'Models/Enum/TerminTyp';
import React         from 'react';
import { observer }  from 'mobx-react';

import { Tag }      from 'Models/Tag';
import { COLOR }    from 'rsuite/utils';
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
    
    const tag        = props.tag;
    const showDigits = true;
    
    if ( tag.istUrlaubstag ) {
        return <Container showDigits={ showDigits }>
            <FreiBar percent={ 100 }><span>{ twoDigit( tag.stundenUrlaub ) }</span></FreiBar>
        </Container>;
    }
    
    if ( tag.istExternGanztaegig ) {
        return <Container showDigits={ showDigits }>
            <IsoBar percent={ 100 }><span>{ twoDigit( tag.stundenExternGeplant ) }</span></IsoBar>
        </Container>;
    }
    
    const p = ( amount : number ) => tag.stundenZuArbeiten / 100 * amount * 100;
    
    let rz  = tag.stundenRemote;
    let sz  = tag.stundenVorOrtRest + tag.stundenVorOrtGeplant;
    let iso = tag.stundenExternGeplant + tag.stundenExternRest;
    
    if ( tag.dateString === '2022-05-20' ) {
        console.log( tag.dateString, {
            rz, sz, iso
        } )
    }
    
    return <Container showDigits={ showDigits }>
        <RzBar percent={ p( rz ) }><span>{ twoDigit( rz ) }</span></RzBar>
        <SzBar percent={ p( sz ) }><span>{ twoDigit( sz ) }</span></SzBar>
        <IsoBar percent={ p( iso ) }><span>{ twoDigit( iso ) }</span></IsoBar>
    </Container>
} );
