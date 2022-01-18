/**
 * @description 渲染配置路由
 * @author Uni
 * @since 1.0
 */

import { Route } from 'react-router-dom'

export default function renderRoutes(routes) {
    return routes.map(item => {
        return (
            <Route path={item.path} element={item.element} index={item.index} key={item.path || "" + item.element}> 
                {
                    
                    item.children && renderRoutes(item.children)
                }
            </Route>
        )
    })
}