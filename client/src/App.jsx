/**
 * @description App entry
 */

import { BrowserRouter as Router } from 'react-router-dom'
import { useHistory } from 'react-router'
import routes from './routes'
import { renderRoutes } from 'react-router-config'
import { useEffect } from 'react';
function App() {

    return (
        <Router>
            {
                renderRoutes(routes)
            }
        </Router>
    )
}

export default App;