function setCountdownTimer() {

    const CurrentDate = new Date();
    const NextYearDate = new Date('1' + ' Jan ' + (CurrentDate.getFullYear() + 1));

    const DaysEl = document.getElementById("days");
    const HoursEl = document.getElementById("hours");
    const MinutesEl = document.getElementById("minutes");
    const SecondsEl = document.getElementById("seconds");

    const DiffInMilliSecs = NextYearDate - CurrentDate;
    const Days = Math.floor(DiffInMilliSecs / (1000 * 60 * 60 * 24));
    const Hours = Math.floor(DiffInMilliSecs / (1000 * 60 * 60) % 24);
    const Minutes = Math.floor(DiffInMilliSecs / (1000 * 60) % 60);
    const Seconds = Math.floor(DiffInMilliSecs / (1000) % 60);

    DaysEl.innerHTML = Days;
    HoursEl.innerHTML = setToTwoDigits(Hours);
    MinutesEl.innerHTML = setToTwoDigits(Minutes);
    SecondsEl.innerHTML = setToTwoDigits(Seconds);

}

function setToTwoDigits(number) {
    return (number < 10) ? ('0' + number) : number;

}

//Initial call
setCountdownTimer();

//Call every one second
setInterval(setCountdownTimer,1000);