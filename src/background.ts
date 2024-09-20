let isFocusMode = false;
let blockList: string[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;


let numberRuleId = 1;

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





            //generate the new rules
            const rules:chrome.declarativeNetRequest.Rule[] = blockList.map((site) => ({
                id: numberRuleId++, // Unique numeric rule ID
                priority: 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                    redirect: {
                        regex: ".*", // Matches all URLs
                        url: chrome.runtime.getURL("blocked.html") // Redirect to blocked.html
                    }
                },
                condition: {
                    urlFilter: `*://*.${site}/*`, // Block requests to the site
                    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] // Only block main frame requests
                }
            }));

            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules
            });

            // start the timer
            startTimer(endTime);
        }
    });
}

function blockRequest(details: chrome.webRequest.WebRequestBodyDetails): chrome.webRequest.BlockingResponse {
    return { redirectUrl: chrome.runtime.getURL("blocked.html") };
}


function stopBlocking() {

    isFocusMode = false;

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }


    // Remove the blocking service

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: blockList.map((_, id) => id + 1)
    });

    // Clear storage

    chrome.storage.local.remove(["blockList", "endTime"]);
    console.log("Focus mode had ended");
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startFocusMode")
        startBlocking();
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'endFocusMode')
        stopBlocking()
})


chrome.runtime.onStartup.addListener(startBlocking);

