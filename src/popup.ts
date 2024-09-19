
const startButton = document.getElementById('startFocus') as HTMLButtonElement;
const durationInput = document.getElementById('duration') as HTMLInputElement;


document.addEventListener("DOMContentLoaded",function() {
    startButton.addEventListener('click',()=>{
        const duration = parseInt(durationInput.value,10);
        if(isNaN(duration) || duration <= 0){
            alert("Please enter a valid duration in minues.");
            return;
        }

        // Calculate the end time in milliseconds
        const endTime = Date.now() + duration * 60 * 1000;

        // Save the end time in local storage
        chrome.storage.local.set({endTime}, ()=>{
            
            // Start the time 
            chrome.runtime.sendMessage({action:"startFocusMode"});

            // Set an alarm when the timer is finished
            chrome.alarms.create("endFocusMode",{when: endTime});
        })


        // Close the popup
        window.close();

    })
});