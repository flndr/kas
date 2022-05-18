import styled       from '@emotion/styled';
import { ColorDot } from 'Components/ColorDot';
import { BREAK }    from 'Styles/media';

export const Box = styled.div`
  flex-grow     : 1;
  width         : ${ 100 / 8 }%;
  padding       : 4px;
  margin        : 2px;
  overflow      : hidden;
  border-radius : 6px;
  cursor        : default;
  text-align    : center;
  color         : var(--rs-border-primary);
`;

export const BoxRZ = styled( Box )`
  color  : var(--rs-text-primary);
  border : 1px solid var(--rs-border-primary);
`;

export const Line = styled.div`
  display         : flex;
  flex-wrap       : nowrap;
  justify-content : space-between;
  align-items     : flex-end;

  & + & {
    margin-top : 0.5rem;
  }

  ${ BREAK.S } {
    margin-top : 0.25rem;
  }
`;

export const Hr = styled.div`
  overflow         : hidden;
  height           : 1px;
  margin           : 0.5rem 0;
  background-color : grey;
  opacity          : 0.5;
`;

export const Pre = styled.span<{ left? : boolean }>`
  position     : relative;
  font-family  : inherit;
  display      : block;
  overflow     : visible;
  margin       : 0;
  padding-left : ${ p => p.left ? 0 : 16 }px;
`;

export const Dot = styled( ColorDot )`
  margin : 0 2px;
`;

export const Op = styled.span`
  position      : absolute;
  left          : 0;
  top           : 0;
  padding-right : 6px;
  text-align    : left;
`;

export const Nw = styled.span`
  white-space : nowrap;
`;
