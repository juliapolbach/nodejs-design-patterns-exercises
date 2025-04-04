// 3.2 Ticker: Write a function that accepts a number and a callback as the arguments.
// The function will return an EventEmitter that emits an event called tick every 50 milliseconds
// until the number of milliseconds is passed from the invocation of the function.
// The function will also call the callback when the number of milliseconds has passed, providing,
// as the result, the total count of tick events emitted. Hint: you can use setTimeout()
// to schedule another setTimeout() recursively.
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

        setTimeout(() => {
                emitter.emit('tick')
                tickCount++
                return tick(timer - INTERVAL, emitter, tickCount, callback)
        }, INTERVAL)
}

ticker(1000, (err, tickCount) => console.log(`Total counts of ticks emitted: ${tickCount}.`))
        .on('tick', () => console.log(`Tick!`))
