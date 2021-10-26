/**
 * @description Sign Page
 */


import { SignWrapper } from './style.js'
import Login from './Login'
import { useState } from 'react'
import Register from './Register.jsx';
function Sign() {
    const [login, setLogin] = useState(true);
    console.log('update');
    return (
        <SignWrapper>
            <div className="container">
                <div className="title">Ripple</div>
                {
                    login ? <Login  setLogin={setLogin}/> : <Register  setLogin={setLogin}/>
                }
            </div>
                
        </SignWrapper>
    )
}

export default Sign