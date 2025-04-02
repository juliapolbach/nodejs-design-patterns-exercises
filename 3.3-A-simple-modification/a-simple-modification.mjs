// 3.3 A simple modification: Modify the function created in exercise 3.2
// so that it emits a tick event immediately after the function is invoked.

import { EventEmitter } from 'events'

function ticker(timer, callback) {
        const emitter = new EventEmitter()
        let tickCount = 0

        tick(timer, emitter, tickCount, callback)
        return emitter
}

function tick(timer, emitter, tickCount, callback) {
        const INTERVAL = 50

        if (timer <= INTERVAL) {
                callback(null, tickCount);
                return;
        }

        // Emit a tick event immediately using process.nextTick
        // to ensure the tick event is emitted immediately, 
        // but asynchronously.
        process.nextTick(() => {
                emitter.emit('tick')
        })

        setTimeout(() => {
                emitter.emit('tick')
                tickCount++
                return tick(timer - INTERVAL, emitter, tickCount, callback)
        }, INTERVAL)
}

ticker(1000, (err, tickCount) => console.log(`Total counts of ticks emitted: ${tickCount}.`))
        .on('tick', () => console.log(`Tick!`))