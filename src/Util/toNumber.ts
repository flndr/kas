export const toNumber = (value : number | string ) : number => {
    if ( typeof value === 'string' ) {
        return parseFloat( value );
    }
    return value;
}
