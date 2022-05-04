import { observer }                            from 'mobx-react';
import React                                   from 'react';
import { Abwesenheiten as AbwesenheitenModel } from 'Models/Anwesenheiten';
import { useReststundenStore }                 from 'Stores/ReststundenStore';

interface Props {
}

export const ListeTage = observer( () => {
    
    const reststundenStore = useReststundenStore();
    
    
    return <>
        { reststundenStore.abwesenheiten.map( a => {
            return <div key={ 'tag-' + a.dateString }>
                { a.istFeiertagOderWE ? 'Feiertag' : 'Arbeitstag' } -
                { a.dateString } -
                { a.zeitAbzglAbwesenheit } -
                { a.zeitZuArbeiten }
            </div>
        } ) }
    </>
} );
