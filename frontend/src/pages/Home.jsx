import React, { useContext } from 'react'
import { DiscordContext } from '../context/DiscordContext'

const Home = () => {
    const { session } = useContext(DiscordContext)
    return (
        <div>
            {session ? `You are logged in as ${session.uername}` : <Link to={process.env.REACT_BACKEND_URL}>Login</Link>}
        </div>
    )
}

export default Home