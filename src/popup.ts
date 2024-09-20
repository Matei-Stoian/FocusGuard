const startButton = document.getElementById('startFocus') as HTMLButtonElement;
const durationInput = document.getElementById('duration') as HTMLInputElement;
const optionLink = document.getElementById('options-link') as HTMLLinkElement | null;
const remainingTime = document.getElementById('remTime') as HTMLParagraphElement | null;
const stopFocusButton = document.getElementById('stopFocus') as HTMLButtonElement;

let timerInterval: NodeJS.Timeout | null = null;

function updateRemaingTime() {
    chrome.storage.local.get(['endTime'], (data) => {
        const endTime = data.endTime || 0;
        const curentTime = Date.now();


        const rTime = endTime - curentTime;
        if (rTime > 0) {
            const remainingMinutes = Math.floor(rTime / 60000);
            const remainingSeconds = Math.floor((rTime % 60000) / 1000);
            if (remainingTime) { remainingTime.innerText = `Time remaining: ${remainingMinutes}m ${remainingSeconds}s`; }
            else {
                console.log("Can not edit the paragraph")
            }

        }
    })
}


// Start the timer for the pop up display 

function startT() {
    timerInterval = setInterval(() => {
        updateRemaingTime();
    }, 1000);
}


function isFocusModeActive(callback: (isActive: boolean) => void) {
    chrome.storage.local.get(['endTime'], (data) => {
        const endTime = data.endTime || 0;
        const currentTime = Date.now();

        if (currentTime < endTime) {
            callback(true);  // Focus mode is active
        } else {
            callback(false); // Focus mode is not active
        }
    });
}



document.addEventListener("DOMContentLoaded", function () {
    updateRemaingTime();

    if (!remainingTime) {
        console.log("Something is wrong with the display time tag");
    }


    isFocusModeActive((isActive) => {
        if (isActive) {
            startButton.style.display = 'none';
            stopFocusButton.style.display = 'block';
        } else {
            startButton.style.display = 'block';
            stopFocusButton.style.display = 'none';
        }
    })

    if (optionLink) {
        optionLink.addEventListener('click', () => { chrome.runtime.openOptionsPage() })
    }



    // Stop the focus mode
    stopFocusButton.addEventListener('click', () => {
        chrome.storage.local.remove('endTime', () => {
            console.log("Focus mode stopped.");
            stopFocusButton.style.display = 'none';
            startButton.style.display = 'block';
            chrome.alarms.create("endFocusMode", { when: Date.now() });
        })
    })



    // Start the focus mode
    startButton.addEventListener('click', () => {
        const duration = parseInt(durationInput.value, 10);
        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid duration in minues.");
            return;
        }

        // Calculate the end time in milliseconds
        const endTime = Date.now() + duration * 60 * 1000;

        // Save the end time in local storage
        chrome.storage.local.set({ endTime }, () => {

            // Start the time 
            chrome.runtime.sendMessage({ action: "startFocusMode" });

            // Set an alarm when the timer is finished
            chrome.alarms.create("endFocusMode", { when: endTime });
        })
        startT();
        startButton.style.display = 'none';
        stopFocusButton.style.display = 'block';
    })
});