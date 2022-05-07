import styled          from '@emotion/styled';
import { Zeiten as Z } from 'Models/Zeiten';
import React           from 'react';
import { twoDigit }    from 'Util/twoDigit';

const Light = styled.span`
  opacity : 0.25;
`;
const Unit  = styled.span`
  margin : 0 0 0 5px;
`;

export const Zeiten = ( { z } : { z : Z } ) => {
    return <span>
        <Light>~ { twoDigit( z.tage ) }<Unit>Tage</Unit></Light>
        <Light> / </Light>
        <span>{ twoDigit( z.stunden ) }<Unit>Stunden</Unit></span>
    </span>;
}
