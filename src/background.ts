let isFocusMode = false;
let blockList: string[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;


let numberRuleId = 1;

function startTimer(endTime: number) {
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Debug rules and check
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        console.log(rules);
    });

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
    numberRuleId = 1;
    chrome.storage.local.get(["blockList", "endTime"], (data) => {
        blockList = data.blockList || [];
        const endTime = data.endTime || 0;

        if (blockList.length && Date.now() < endTime) {
            isFocusMode = true;





            //generate the new rules
            const rules:chrome.declarativeNetRequest.Rule[] = blockList.map((site) => {{
                
                let cleanSite = site.replace(/^https?:\/\//, '') // Remove protocol
                cleanSite = cleanSite.replace(/\/.*$/, '') // Remove any path
                cleanSite = cleanSite.replace(/^[^.]+\./, '');
                return {id: numberRuleId++, // Unique numeric rule ID
                priority: 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                    redirect: {
                        url: chrome.runtime.getURL("blocked.html") // Redirect to blocked.html
                    }
                },
                condition: {
                    urlFilter: `*://*.${cleanSite}/*`, // Block requests to the site
                    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] // Only block main frame requests
                }
            }}});

            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules,
                removeRuleIds: []
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

    chrome.storage.local.remove(["endTime"]);
    console.log("Focus mode had ended");

    // Check the rules at the end
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        console.log(rules);
    })
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

