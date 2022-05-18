import styled                     from '@emotion/styled';
import React                      from 'react';
import { media }                  from 'Styles/media';

interface SplitProps {
    splitOn : number | string;
}

interface SplitLayoutProps {
    left : React.ReactNode;
    right : React.ReactNode;
}

const mediaQuery = ( value : string | number ) => {
    if ( typeof value === 'string' ) {
        return value;
    } else {
        return media( value );
    }
}

const Container = styled.div<SplitProps>`

  & > * + * {
    margin-top : 2rem;
    //border-top  : 1px solid var(--rs-divider-border);
    //padding-top : 1rem;
  }

  ${ p => mediaQuery( p.splitOn ) } {
    display         : flex;
    justify-content : space-between;
    align-items     : flex-start;

    & > * {
      width : 50%;
    }

    & > * + * {
      margin-top  : 0;
      border-top  : 0;
      padding-top : 0;
    }
  }
`;

const Left = styled.div<SplitProps>`
  ${ p => mediaQuery( p.splitOn ) } {
    padding-right : 2rem;
  }
`;

const Right = styled.div<SplitProps>`
  ${ p => mediaQuery( p.splitOn ) } {
    padding-left : 2rem;
  }
`;

export const SplitLayout : React.FC<SplitLayoutProps & SplitProps> = ( props ) => {
    
    return <Container splitOn={ props.splitOn }>
        <Left splitOn={ props.splitOn }>
            { props.left }
        </Left>
        <Right splitOn={ props.splitOn }>
            { props.right }
        </Right>
    </Container>
}
