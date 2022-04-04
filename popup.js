let inputTextBanner = document.querySelector('#input-skip-text-banner-ads');
let inputImgBanner = document.querySelector('#input-skip-img-banner-ads');
let inputVideoBanner = document.querySelector('#input-skip-video-ads');
let saveButton = document.querySelector('#save-button');
let optionTimeout = document.querySelector('#timeout-select');

let payload;
let config;

saveButton.addEventListener('click', (event) => {
    // sending data to consent
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs[0].url.includes('https://www.youtube.com')) {
            return;
        }

        // feature config
        config = {
            isTextAdSkip: inputTextBanner.checked,
            isImgAdSkip: inputImgBanner.checked,
            isVideoSkip: inputVideoBanner.checked,
            timeout: optionTimeout.options[optionTimeout.selectedIndex].value,
        };

        // payload to send
        payload = {
            config,
        };

        // sending message to inject
        chrome.tabs.sendMessage(tabs[0].id, payload);
    });

    saveButton.textContent = 'saved!';
    setTimeout(() => {
        saveButton.textContent = 'save';
    }, 2000);
});

// sending data to consent - UI update
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        { command: 'get' },
        function (response) {
            if (response) {
                inputImgBanner.checked = response.isImgAdSkip;
                inputTextBanner.checked = response.isTextAdSkip;
                inputVideoBanner.checked = response.isVideoSkip;
                optionTimeout.value =
                    response.timeout != null ? response.timeout : 0;
            }
        }
    );
});
