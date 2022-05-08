import { parse }  from 'date-fns';
import { format } from 'date-fns';

export const DATE_FORMAT : string = 'yyyy-MM-dd';

export const dateToString = ( date : Date ) : string => {
    return format( date, DATE_FORMAT );
}

export const stringToDate = ( date : string ) : Date => {
    return parse( date, DATE_FORMAT, new Date() );
}

export const toDate = ( date : Date | string ) : Date => {
    if ( date instanceof Date ) {
        return date;
    }
    return stringToDate( date );
}

export const toString = ( date : Date | string ) : string => {
    if ( date instanceof Date ) {
        return dateToString( date );
    }
    return date;
}
