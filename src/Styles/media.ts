export const media = ( px : number ) => `@media all and (min-width: ${ px }px)`;

export const BREAK = {
    S  : media( 576 ),
    M  : media( 768 ),
    L  : media( 992 ),
    XL : media( 1200 )
};

