console.log('test');

let inputTextBanner = document.querySelector('#input-skip-text-banner-ads');
let inputImgBanner = document.querySelector('#input-skip-img-banner-ads');
let inputVideoBanner = document.querySelector('#input-skip-video-ads');
let saveButton = document.querySelector('#save-button');

let payload;
let config;

saveButton.addEventListener('click', (event) => {
    console.log('save button is clicked');

    // sending data to consent
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs[0].url.includes('https://www.youtube.com')) {
            alert('please go to https://www.youtube.com');
            return;
        }

        console.log('isTextAdSkip:', inputTextBanner.checked);
        console.log('isImgAdSkip:', inputImgBanner.checked);
        console.log('isVideoSkip:', inputVideoBanner.checked);

        // feature config
        config = {
            isTextAdSkip: inputTextBanner.checked,
            isImgAdSkip: inputImgBanner.checked,
            isVideoSkip: inputVideoBanner.checked,
        };

        // payload to send
        payload = {
            config,
        };

        // sending message to inject
        chrome.tabs.sendMessage(tabs[0].id, payload);
    });
});

// sending data to consent
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        { command: 'get' },
        function (response) {
            console.log(response);
            inputImgBanner.checked =
                response.isImgAdSkip == 'true' ? true : false;
            inputTextBanner.checked =
                response.isTextAdSkip == 'true' ? true : false;
            inputVideoBanner.checked =
                response.isVideoSkip == 'true' ? true : false;
        }
    );
});
