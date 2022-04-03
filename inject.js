// inject script

console.log('inject.js is working...');

let debug = true;
let refreshRate = 500;

let bannerTextInv = null;
let bannerImageInv = null;
let videoAdInv = null;

// read from session storage
let config = {
    isTextAdSkip: false,
    isImgAdSkip: false,
    isVideoSkip: false,
};

// check session storage values
config = checkSession(config);

// NOTES:
// banner text overlay class: ytp-ad-text-overlay
// banner img class : ytp-ad-overlay-image
// banner close button class: ytp-ad-overlay-close-button
// video ad class ytp-ad-preview-image
// video ad skip button class: ytp-ad-skip-button

// event listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request) return;

    if (request.command === 'get') {
        console.log(request);
        config = checkSession(config);
        sendResponse(config);
    } else {
        console.log(request);

        // refreshRate = request.refreshRate;

        // config
        config = {
            isTextAdSkip: request.config.isTextAdSkip,
            isImgAdSkip: request.config.isImgAdSkip,
            isVideoSkip: request.config.isVideoSkip,
        };

        console.log(config.isTextAdSkip);
        console.log(config.isImgAdSkip);
        console.log(config.isVideoSkip);

        setSession(config);
        setSkippers(config);
    }
});

// banner text function
function setBannerText() {
    try {
        let mainTextAdOverlay = document.querySelector('.ytp-ad-text-overlay');
        let bannerTextAdElement = mainTextAdOverlay.querySelector(
            '.ytp-ad-overlay-close-container'
        );
        let bannerTextAdClose = bannerTextAdElement.querySelector(
            '.ytp-ad-overlay-close-button'
        );
        if (debug) console.log('banner text ad is detected');

        bannerTextAdClose.click();
        if (debug) console.log('banner text ad is closed');
    } catch (error) {
        // console.log(error);
    }
}

// banner image function
function setBannerImg() {
    if (
        document.querySelector('.ytp-ad-overlay-image') != null &&
        document.querySelector('.ytp-ad-overlay-close-button' != null)
    ) {
        if (debug) console.log('banner image ad is detected!');
        try {
            document
                .querySelector('.ytp-ad-overlay-close-container')
                .querySelector('.ytp-ad-overlay-close-button')
                .click();
            if (debug) console.log('banner image ad is closed');
        } catch (error) {
            // console.log(error);
        }
    }
}

// video ad function
function setVideoAd() {
    if (document.querySelector('.ytp-ad-preview-image') != null) {
        if (debug) console.log('video ad is detected!');
        try {
            document.querySelector('.ytp-ad-skip-button').click();
            if (debug) console.log('video ad is skipped');
        } catch (error) {
            // console.log(error);
        }
    }
}

function setSkippers(config) {
    // set image banner
    console.log(config);
    if (config.isImgAdSkip == true) {
        bannerImageInv = setInterval(setBannerText, refreshRate);
        if (debug) console.log('banner image ad skipper is active...');
    } else {
        clearInterval(bannerImageInv);
        if (debug) console.log('banner image ad skipper is deactive...');
    }

    // set text banner
    if (config.isTextAdSkip == true) {
        bannerTextInv = setInterval(setBannerImg, refreshRate);
        if (debug) console.log('banner text ad skipper is active...');
    } else {
        clearInterval(bannerTextInv);
        if (debug) console.log('banner text ad skipper is deactive...');
    }

    // set video ad
    if (config.isVideoSkip == true) {
        videoAdInv = setInterval(setVideoAd, refreshRate);
        if (debug) console.log('video ad skipper is active...');
    } else {
        clearInterval(videoAdInv);
        if (debug) console.log('video ad skipper is deactive...');
    }
}

// set session storage function
function checkSession() {
    let isTextAdSkip = window.localStorage.getItem('text-banner-skip');
    let isImgAdSkip = window.localStorage.getItem('image-banner-skip');
    let isVideoSkip = window.localStorage.getItem('video-ad-skip');

    if (isTextAdSkip == null) {
        isTextAdSkip = true;
        window.localStorage.setItem('text-banner-skip', isTextAdSkip);
    }

    if (isImgAdSkip == null) {
        isImgAdSkip = true;
        window.localStorage.setItem('image-banner-skip', isImgAdSkip);
    }

    if (isVideoSkip == null) {
        isVideoSkip = true;
        window.localStorage.setItem('video-ad-skip', isVideoSkip);
    }

    let c = {
        isTextAdSkip: isTextAdSkip,
        isImgAdSkip: isImgAdSkip,
        isVideoSkip: isVideoSkip,
    };

    return c;
}

function setSession(config) {
    window.localStorage.setItem('text-banner-skip', config.isTextAdSkip);
    window.localStorage.setItem('image-banner-skip', config.isImgAdSkip);
    window.localStorage.setItem('video-ad-skip', config.isVideoSkip);
}

// setting skippers
setSkippers(config);
