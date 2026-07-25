/**
 * ==========================================================
 * Le Carnet des Gagnants
 * EventBus.js
 * Communication entre composants
 * ==========================================================
 */

class EventBus {

    constructor() {

        this.events = new Map();

    }

    on(eventName, callback) {

        if (!this.events.has(eventName)) {

            this.events.set(eventName, []);

        }

        this.events.get(eventName).push(callback);

    }

    off(eventName, callback) {

        if (!this.events.has(eventName)) {

            return;

        }

        const callbacks = this.events.get(eventName);

        this.events.set(

            eventName,

            callbacks.filter(cb => cb !== callback)

        );

    }

    emit(eventName, data = null) {

        if (!this.events.has(eventName)) {

            return;

        }

        this.events.get(eventName).forEach(callback => {

            callback(data);

        });

    }

}

export default new EventBus();