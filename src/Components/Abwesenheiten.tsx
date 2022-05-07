import React        from 'react';
import { observer } from 'mobx-react';

import { CalculatorStore }    from 'Stores/CalculatorStore';
import { useCalculatorStore } from 'Stores/CalculatorStore';

interface Props {
}

export const Abwesenheiten = observer( () => {
    
    const calculator : CalculatorStore = useCalculatorStore();
    
    return <>
        { calculator.keinRemote.map( kr => {
            return <div key={ kr.dateString }>
                { kr.dateString } - { kr.typ } - { kr.stundenAbwesend }
            </div>
        } ) }
    </>
} );
