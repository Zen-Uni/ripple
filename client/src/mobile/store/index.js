/**
 * @description 状态管理 store
 * @author Uni
 * @since 1.0
 */

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(
    reducer,
    // redux 状态可视化插件
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store