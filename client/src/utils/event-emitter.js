/**
 * @description 发布订阅中心，实现数据传递
 * @author Uni
 * @since 1.0
 */

class EventEmmier {
    constructor() {
        this.map = {}
    }

    // 订阅事件
    on(event, handler) {
        // 过滤
        if (!(handler instanceof Function)) {
            throw new Error('handler 必须是个函数')
        }

        if (!this.map[event]) {
            this.map[event] = []
        }

        this.map[event].push(handler)
    }

    // 发布事件
    emit(event, ...params) {
        console.log('okkk')
        if (this.map[event]) {
            this.map[event].forEach(handler => {
                console.log('arams')
                handler(...params)
            })
        }
    }

    // 卸载事件
    off(event, handler) {
        if (this.map[event]) {
            this.map[event].splice(this.map[event].indexOf(handler) >>> 0, 1)
        }
    }
} 

export default EventEmmier