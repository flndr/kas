import styled    from '@emotion/styled';

export const ColorDot = styled.span<{ color : string }>`
  display          : inline-block;
  width            : 10px;
  height           : 10px;
  border-radius    : 50%;
  background-color : ${ p => p.color || 'yellow' };
`;
