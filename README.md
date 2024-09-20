# FocusGuard - Chrome Extension for Better Focus

**FocusGuard** is a lightweight Chrome extension designed to help you stay focused by blocking distracting websites. Whether you're working, studying, or just need some downtime from social media and other time-wasting sites, FocusGuard helps you stay on track and improve productivity.

## Features

* **Customizable Blocklist:** Easily add or remove websites from the blocklist.
* **Session Timers:** Set focus periods where distracting websites are blocked.
* **Notifications:** Alerts you when you've tried to access a blocked site.
* **Pause Mode:** Temporarily disable the blocking for a break.
* **Lightweight & User-Friendly:** Simple interface that integrates smoothly with your browser.

## Installation

1. **Clone the repository;**

```bash
git clone https://github.com/Matei-Stoian/FocusGuard.git
```

2. **Install the packages needed and build the code:**

```bash
npm install
npm run build
```
3. Load as an Unpacked Extension:

    * Open Chrome and go to chrome://extensions/
    * Enable "Developer mode" in the top right corner
    * Click on "Load unpacked" and select the FocusGuard directory

4. Start Using FocusGuard:
Once installed, click on the FocusGuard icon in your Chrome toolbar to open the interface and manage your settings.


## How to Use
1. Block Websites:

    * Click on the extension icon in the toolbar.
    * Add the URLs of websites you want to block in the input field and click "Add."
    * The sites will be blocked immediately during focus sessions.

2. Start a Focus Session:

    * Set the duration of the focus session (e.g., 25 minutes).
    * Click "Start Focus" to block the sites on your list.
    * FocusGuard will keep you on track by preventing access to the blocked sites during this time.

3. Stop FocusGuard:
If you need a break, you can stop timer and then start a new session again.

4. Remove a Website:
    If you want to remove a site from the blocklist, click on the options link and then simply click the "X" button next to the URL.


## Development

If you'd like to contribute to FocusGuard, feel free to submit pull requests or open issues for bug reports or feature suggestions.

1. **Clone the repo:**
```bash
git clone https://github.com/Matei-Stoian/FocusGuard.git
```

2. **Modify the Code:**
    Feel free to add features or fix bugs by editing the TypeScript, HTML, and CSS files.

3. **Test Locally:**
    * Load the unpacked extension into Chrome as described above.
    * Make sure your changes are working as expected.

4. **Submit a Pull Request:**
    Once your changes are tested, submit a pull request for review!



Created by [Matei Stoian](mailto:stoian.matei782@gmail.com).