export const twoDigit = ( value : number ) : string => {
    return /*( 0 > value ? '-' : '' ) +*/ value.toFixed( 2 );
}
