import { useContext } from 'react'
import { LastUpdateContext } from '../context/index'

const LastUpdated = () => {
    const lastUpdated = useContext(LastUpdateContext);
    return <div className='my-3'>Last update: {lastUpdated}</div>
}

export default LastUpdated