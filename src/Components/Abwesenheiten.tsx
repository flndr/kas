import { observer }                            from 'mobx-react';
import React                                   from 'react';
import { Abwesenheiten as AbwesenheitenModel } from 'Models/Anwesenheiten';
import { useReststundenStore }                 from 'Stores/ReststundenStore';

interface Props {
}

export const Abwesenheiten = observer( () => {
    
    const reststundenStore = useReststundenStore();
    
    return <>
        { reststundenStore.abwesenheiten.map( a => {
            return <div key={ a.dateString }>
                { a.dateString } - { a.zeitAbzglAbwesenheit }
            </div>
        } ) }
    </>
} );
