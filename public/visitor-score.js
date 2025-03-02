(function() {
    var score = 0;
    var storageKey = "visitor_score";

    function getGACookie() {
        var match = document.cookie.match(/_ga=([^.]+)\./);
        return match ? match[1] : null;
    }

    var gaCookie = getGACookie();
    var isReturningUser = localStorage.getItem("ga_user") === gaCookie;

    if (!gaCookie) {
        console.log("GA cookie not found");
        return;
    }

    if (!isReturningUser) {
        localStorage.setItem("ga_user", gaCookie);
        score += 1;
    } else {
        score += 1;
    }

    var referrer = document.referrer;
    var isOrganic = /google|bing|yahoo|duckduckgo/.test(referrer);
    var isDirect = referrer === "" || referrer === window.location.origin;

    if (isOrganic || isDirect) {
        score += 2;
    }

    var startTime = Date.now();
    window.addEventListener("beforeunload", function() {
        var timeSpent = (Date.now() - startTime) / 1000;
        if (timeSpent > 100) {
            var currentScore = parseInt(localStorage.getItem(storageKey) || "0", 10);
            localStorage.setItem(storageKey, currentScore + 2);
        }
    });

    var currentScore = parseInt(localStorage.getItem(storageKey) || "0", 10);
    localStorage.setItem(storageKey, currentScore + score);

    console.log("Visitor Score:", localStorage.getItem(storageKey));
})();
