
const startButton = document.getElementById('startFocus') as HTMLButtonElement;
const durationInput = document.getElementById('duration') as HTMLInputElement;
const optionLink = document.getElementById('options-link') as HTMLLinkElement | null;
const remainingTime = document.getElementById('remaining-time') as HTMLParagraphElement;
const stopFocusButton = document.getElementById('stopFocus') as HTMLButtonElement;
function updateRemaingTime(){
chrome.storage.local.get(['endTime'],(data) =>{
    const endTime = data.endTime || 0;
    const curentTime = Date.now();


    const rTime = endTime - curentTime;
    if(rTime > 0)
    {
        const remainingMinutest = Math.ceil(rTime / 60000);
       
        stopFocusButton.style.display = 'block';
    }else{
        
        stopFocusButton.style.display = 'none';
    }
})
}
document.addEventListener("DOMContentLoaded",function() {
    updateRemaingTime();   
    if(optionLink)
    {
        optionLink.addEventListener('click',()=>{chrome.runtime.openOptionsPage()})
    }
    


    // Stop the focus mode
    stopFocusButton.addEventListener('click', ()=>{
        chrome.storage.local.remove('endTime',()=>{
            console.log("Focus mode stopped.");
            stopFocusButton.style.display = 'none';
            chrome.alarms.create("endFocusMode",{when: Date.now()});
        })
    })



    // Start the focus mode
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


    })
});