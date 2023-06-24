import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { DiscordContext } from './context/DiscordContext';
import Home from './pages/Home';

const App = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      await axios.get(`/api/session`, { withCredentials: true, })
        .then((res) => {
          setSession(res?.data)
        })
        .catch(() => {
          setSession(null)
        })
    }
    getUser();
  }, []);
  return (
    <DiscordContext.Provider value={{ session }}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </DiscordContext.Provider>
  )
}

export default App