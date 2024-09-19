let isFocusMode = false;
let blockList: string[] = [];
let intervalId: number | null = null;


function startTimer(endTime: number) {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        const curentTime = Date.now()
        const remainingTime = endTime - curentTime

        if (remainingTime <= 0) {
            stopBlocking();
        } else {
            console.log(`Focus mode active. Time remaining: ${Math.ceil(remainingTime / 1000)} seconds`);
        }
    }, 1000)
}


function startBlocking() {
    chrome.storage.local.get(["blockList", "endTime"], (data) => {
        blockList = data.blockList || [];
        const endTime = data.endTime || 0;

        if (blockList.length && Date.now() < endTime) {
            isFocusMode = true;

            // block the incoming requests from the blocked sites
            chrome.webRequest.onBeforeRequest.addListener(
                blockRequest,
                { urls: blockList.map(site => `*://*.${site}/*`) },
                ["blocking"]
            );

            // start the timer
            startTimer(endTime);
        }
    });
}

function blockRequest(details: chrome.webRequest.WebRequestBodyDetails): chrome.webRequest.BlockingResponse{
    return {redirectUrl: chrome.runtime.getURL("blocked.html")};
}


function stopBlocking() {

    isFocusMode = false;

    if(intervalId)
    {
        clearInterval(intervalId);
        intervalId = null;
    }


    // Remove the blocking service

    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);

    // Clear storage

    chrome.storage.local.remove(["blockList","endTime"]);
    console.log("Focus mode had ended");
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "startFocusMode")
        startBlocking();
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === 'endFocusMode')
        stopBlocking()
})


chrome.runtime.onStartup.addListener(startBlocking);

