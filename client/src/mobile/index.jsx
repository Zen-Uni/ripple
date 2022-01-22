/**
 * @description Web Mobile 根组件
 * 
 */

import { Routes } from 'react-router-dom'
import renderRoutes from '../utils/route-config'
import { AuthProvider } from './hooks/useAuth'
import routes from './routes'


export default function Mobile() {
    return (
        <AuthProvider>
            <Routes>
                {
                    renderRoutes(routes)
                }
            </Routes>
        </AuthProvider>
    )
}