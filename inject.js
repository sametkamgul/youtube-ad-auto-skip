console.log('inject.js is working...');

var debug = false;
var refreshRate = 500;
// banner text overlay class: ytp-ad-text-overlay
// banner img class : ytp-ad-overlay-image
// banner close button class: ytp-ad-overlay-close-button
function bannerTextSkipper(refreshRate) {
    setInterval(() => {
        try {
            var mainTextAdOverlay = document.querySelector(
                '.ytp-ad-text-overlay'
            );
            var bannerTextAdElement = mainTextAdOverlay.querySelector(
                '.ytp-ad-overlay-close-container'
            );
            var bannerTextAdClose = bannerTextAdElement.querySelector(
                '.ytp-ad-overlay-close-button'
            );
            if (debug) console.log('banner text ad is detected');

            bannerTextAdClose.click();
            if (debug) console.log('banner text ad is closed');
        } catch (error) {
            // console.log(error);
        }
    }, refreshRate);
    if (debug) console.log('banner text ad skipper is active...');
}

function bannerImageSkipper(refreshRate) {
    setInterval(() => {
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
    }, refreshRate);
    if (debug) console.log('banner image ad skipper is active...');
}

// video ad class ytp-ad-preview-image
// video ad skip button class: ytp-ad-skip-button
function videoAdSkipper(refreshRate) {
    setInterval(() => {
        if (document.querySelector('.ytp-ad-preview-image') != null) {
            if (debug) console.log('video ad is detected!');
            try {
                document.querySelector('.ytp-ad-skip-button').click();
                if (debug) console.log('video ad is skipped');
            } catch (error) {
                // console.log(error);
            }
        }
    }, refreshRate);
    if (debug) console.log('video ad skipper is active...');
}

videoAdSkipper();
bannerTextSkipper();
bannerImageSkipper();
