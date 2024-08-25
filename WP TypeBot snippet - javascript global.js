const typebotInitScript = document.createElement("script");
typebotInitScript.type = "module";
typebotInitScript.innerHTML = `
import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.4/dist/web.js';

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
}

// Function to get UTM parameters from the URL
function getUTMParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_keyword', 'utm_content'];

    utmParams.forEach(param => {
        if (urlParams.has(param)) {
            params[param] = urlParams.get(param);
            setCookie(param, params[param], 30); // Save UTM params in cookies
        }
    });

    return params;
}

// Check if the HTTP_REFERER cookie exists; if not, set it
if (!getCookie('HTTP_Referer') && document.referrer && !document.referrer.includes(window.location.hostname)) {
    setCookie('HTTP_Referer', document.referrer, 30);
}

// Load UTM params from cookies if not present in the URL
const utmParamsFromCookies = getUTMParams();
['utm_source', 'utm_campaign', 'utm_medium', 'utm_keyword', 'utm_content'].forEach(param => {
    if (!utmParamsFromCookies[param]) {
        const cookieValue = getCookie(param);
        if (cookieValue) {
            utmParamsFromCookies[param] = cookieValue;
        }
    }
});

// Get the current WordPress POST_ID from the global window object if it exists
const POST_ID = window.wp?.post?.id;

// Prefilled variables using the cookies or direct parameters
const prefilledVariables = {
    PostURI: window.location.href, // Full URL of the page
    HTTP_Referer: getCookie('HTTP_Referer') || document.referrer, // Use the referer from the cookie if available
    POST_ID: POST_ID, // WordPress post ID if available
    ...utmParamsFromCookies // Add the UTM parameters from cookies or URL
};

Typebot.initStandard({
  typebot: "intake",
  apiHost: "https://bot.stonesoup.exchange",
  prefilledVariables: prefilledVariables
});
`;

document.body.append(typebotInitScript);
