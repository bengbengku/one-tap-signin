import { useState, useEffect } from 'react';
import googleOneTap from 'google-one-tap';
import axios from 'axios';
import LoginForm from './components/Form/LoginForm';
import BadgeUser from './components/BadgeUser';

const options = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  auto_select: false,
  cancel_on_tap_outside: false,
  context: 'signin',
};

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null
  );

  useEffect(() => {
    if (!loginData) {
      googleOneTap(options, async (res) => {
        console.log(res);
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/google-login`,
            {
              token: res.credential,
            }
          );
          setLoginData(data);
          localStorage.setItem('loginData', JSON.stringify(data));
        } catch (err) {
          console.log(err.response.data.message);
        }
      });
    }
  }, [loginData]);

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {loginData ? (
            <BadgeUser handleLogout={handleLogout} loginData={loginData} />
          ) : (
            <LoginForm setLoginData={setLoginData} />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
