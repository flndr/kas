import styled          from '@emotion/styled';
import { Zeiten as Z } from 'Models/Zeiten';
import React           from 'react';
import { BREAK }       from 'Styles/media';
import { twoDigit }    from 'Util/twoDigit';

const BREAK_LINES = BREAK.S;

const Container = styled.span`
  display         : flex;
  flex-wrap       : wrap;
  justify-content : flex-end;
  align-items     : flex-end;
  text-align      : right;

  ${ BREAK_LINES } {
    flex-wrap : nowrap;
  }
`;

const Days = styled.span`
  opacity : 0.25;
  width   : 100%;

  ${ BREAK_LINES } {
    width : 140px;
  }
`;

const Hours = styled.span`
  width : 100%;

  ${ BREAK_LINES } {
    width : 140px;
  }
`;

const Unit = styled.span`
  margin : 0 0 0 5px;
`;

export const Zeiten = ( { z } : { z : Z } ) => {
    return <Container>
        <Days>~ { twoDigit( z.tage ) }<Unit>Tage</Unit></Days>
        <Hours>{ twoDigit( z.stunden ) }<Unit>Stunden</Unit></Hours>
    </Container>;
}
