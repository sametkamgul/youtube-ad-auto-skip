// inject script

let debug = true;
let refreshRate = 500;

let bannerTextInv = null;
let bannerImageInv = null;
let videoAdInv = null;

//flags
let bannerTextFlag = true;
let bannerImageFlag = true;
let videoAdFlag = true;

// read from session storage
let config = {
    isTextAdSkip: false,
    isImgAdSkip: false,
    isVideoSkip: false,
    timeout: 0,
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
        config = checkSession(config);
        sendResponse(config);
    } else {
        // config
        config = {
            isTextAdSkip: request.config.isTextAdSkip,
            isImgAdSkip: request.config.isImgAdSkip,
            isVideoSkip: request.config.isVideoSkip,
            timeout: request.config.timeout,
        };

        setSession(config);
        setSkippers(config);
    }
});

// banner text function
function setBannerText(timeout) {
    try {
        let mainTextAdOverlay = document.querySelector('.ytp-ad-text-overlay');
        let bannerTextAdElement = mainTextAdOverlay.querySelector(
            '.ytp-ad-overlay-close-container'
        );
        let bannerTextAdClose = bannerTextAdElement.querySelector(
            '.ytp-ad-overlay-close-button'
        );
        if (debug) console.log('banner text ad is detected');
        if (bannerTextFlag) {
            setTimeout(() => {
                bannerTextAdClose.click();
                if (debug) console.log('banner text ad is closed');
                bannerTextFlag = true;
            }, timeout);
            bannerTextFlag = false;
        }
    } catch (error) {
        // console.log(error);
    }
}

// banner image function
function setBannerImg(timeout) {
    if (
        document.querySelector('.ytp-ad-overlay-image') != null &&
        document.querySelector('.ytp-ad-overlay-close-button' != null)
    ) {
        if (debug) console.log('banner image ad is detected!');
        try {
            if (bannerImageFlag) {
                setTimeout(() => {
                    document
                        .querySelector('.ytp-ad-overlay-close-container')
                        .querySelector('.ytp-ad-overlay-close-button')
                        .click();
                    if (debug) console.log('banner image ad is closed');
                    bannerImageFlag = true;
                }, timeout);
                bannerImageFlag = false;
            }
        } catch (error) {
            // console.log(error);
        }
    }
}

// video ad function
function setVideoAd(timeout) {
    console.log('timeout', timeout);
    try {
        if (
            document.querySelector('.ytp-ad-preview-image') != null &&
            document.querySelector('.ytp-ad-skip-button-container').style
                .display != 'none'
        ) {
            if (debug) console.log('video ad is detected!');
            if (videoAdFlag) {
                setTimeout(() => {
                    document.querySelector('.ytp-ad-skip-button').click();
                    if (debug) console.log('video ad is skipped');
                    videoAdFlag = true;
                }, timeout);
                videoAdFlag = false;
            }
        }
    } catch (error) {
        // console.log(error);
    }
}

function setSkippers(config) {
    // clear intervals
    clearInterval(bannerTextInv);
    clearInterval(bannerImageInv);
    clearInterval(videoAdInv);

    console.log(config);

    // set image banner
    if (config.isImgAdSkip == true) {
        bannerImageInv = setInterval(() => {
            setBannerText(config.timeout);
        }, refreshRate);
        if (debug) console.log('banner image ad skipper is active...');
    } else {
        clearInterval(bannerImageInv);
        if (debug) console.log('banner image ad skipper is deactive...');
    }

    // set text banner
    if (config.isTextAdSkip == true) {
        bannerTextInv = setInterval(() => {
            setBannerImg(config.timeout);
        }, refreshRate);
        if (debug) console.log('banner text ad skipper is active...');
    } else {
        clearInterval(bannerTextInv);
        if (debug) console.log('banner text ad skipper is deactive...');
    }

    // set video ad
    if (config.isVideoSkip == true) {
        videoAdInv = setInterval(() => {
            setVideoAd(config.timeout);
        }, refreshRate);
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
    let timeout = window.localStorage.getItem('skip-timeout');

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

    if (timeout == null) {
        timeout = 0;
        window.localStorage.setItem('skip-timeout', timeout);
    }

    // FIXME: find a proper solution here: string 'true' to boolian true override
    let c = {
        isTextAdSkip: isTextAdSkip == 'true' ? true : false,
        isImgAdSkip: isImgAdSkip == 'true' ? true : false,
        isVideoSkip: isVideoSkip == 'true' ? true : false,
        timeout: timeout,
    };

    console.log('c', c);

    return c;
}

function setSession(config) {
    window.localStorage.setItem('text-banner-skip', config.isTextAdSkip);
    window.localStorage.setItem('image-banner-skip', config.isImgAdSkip);
    window.localStorage.setItem('video-ad-skip', config.isVideoSkip);
    window.localStorage.setItem('skip-timeout', config.timeout);
}

// setting skippers
setSkippers(config);
