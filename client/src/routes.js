/**
 * @description routes config
 */

import Sign from "./Module/Sign"
import Main from "./Module/Main"


const routes = [
    {
        path: '/sign',
        exact: true,
        component: Sign
    },
    {
        path: '/',
        exact: true,
        component: Main
    }
]

export default routes;