export default class Timer {

    constructor(duration) {
        this.duration = duration;
        this.remainingTime = duration;
        this.interval = null;
    }


    start(onTick, onComplete) {

        this.stop();

        this.remainingTime = this.duration;

        onTick(this.remainingTime);

        this.interval = setInterval(() => {

            this.remainingTime--;

            onTick(this.remainingTime);

            if (this.remainingTime <= 0) {

                this.stop();

                onComplete();
            }

        }, 1000);
    }


    stop() {

        if (this.interval) {

            clearInterval(this.interval);

            this.interval = null;
        }
    }


    reset() {

        this.stop();

        this.remainingTime = this.duration;
    }

}