import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Specials = () => {
    const specials = useSelector((state: RootState) => state.specials.SPECIALS);
    return (
        <>
            <div className="row g-4 m-4">
                {specials.map((special, i) =>
                <div className='col-4' key={i}>
                    <div className='card p-2 d-flex flex-column gap-2'>
                        <span>{special.cinema}</span>
                        <span>{special.title}</span>
                    </div>
                </div>
            )}
            </div>
        </>
    )
}

export default Specials