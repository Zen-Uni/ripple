/**
 * @description Web Mobile 根组件
 * 
 */

import { Routes } from 'react-router-dom'
import renderRoutes from '../utils/route-config'
import { AuthProvider } from './hooks/useAuth'
import routes from './routes'
import store from './store'
import { Provider } from 'react-redux';


export default function Mobile() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Routes>
                    {
                        renderRoutes(routes)
                    }
                </Routes>
            </AuthProvider>
        </Provider>
    )
}