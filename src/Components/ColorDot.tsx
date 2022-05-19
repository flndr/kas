import styled from '@emotion/styled';

export const ColorDot = styled.span<{ color : string, size? : number }>`
  display          : inline-block;
  width            : 10px;
  height           : ${ p => p.size || 10 }px;
  border-radius    : 50%;
  background-color : ${ p => p.color || 'yellow' };
`;
