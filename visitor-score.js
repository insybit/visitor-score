(function () {
    let visitorData = {
        timeSpent: 0,
        sources: getStoredSources(),
        isReturningUser: checkReturningUser(),
        deviceBrand: getDeviceBrand(),
        pageScrollDepth: 0,
    };

    function getTrafficSource() {
        const referrer = document.referrer;
        if (!referrer) return "direct";
        if (referrer.includes("google.")) return "organic";
        if (referrer.includes("bing.") || referrer.includes("yahoo.")) return "organic";
        if (referrer.includes("facebook.") || referrer.includes("instagram.")) return "social";
        if (document.location.href.includes("gclid")) return "paid search";
        if (document.location.href.includes("utm_source=display")) return "display";
        if (document.location.href.includes("utm_source=dv360")) return "dv360";
        if (document.location.href.includes("utm_source=email")) return "email";
        return "referral";
    }

    function getStoredSources() {
        let sources = JSON.parse(localStorage.getItem("visitorSources")) || [];
        let newSource = getTrafficSource();
        if (!sources.includes(newSource)) {
            sources.push(newSource);
            localStorage.setItem("visitorSources", JSON.stringify(sources));
        }
        return sources;
    }

    function checkReturningUser() {
        let returning = localStorage.getItem("returningUser");
        if (!returning) {
            localStorage.setItem("returningUser", "true");
            return false; // New user
        }
        return true; // Returning user
    }

    function getDeviceBrand() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "apple";
        if (userAgent.includes("pixel")) return "google";
        if (userAgent.includes("oneplus")) return "oneplus";
        if (userAgent.includes("samsung")) return "samsung";
        return "other";
    }

    function getTotalTimeSpent() {
        return parseInt(localStorage.getItem("totalTimeSpent")) || 0;
    }

    function updateTotalTimeSpent() {
        let totalTime = getTotalTimeSpent() + 1;
        localStorage.setItem("totalTimeSpent", totalTime);
        visitorData.timeSpent = totalTime;
        updateCategory();
    }

    function trackTimeSpent() {
        setInterval(updateTotalTimeSpent, 1000); // Increase time every second
    }

    function trackScrollDepth() {
        window.addEventListener("scroll", () => {
            let scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            visitorData.pageScrollDepth = Math.max(visitorData.pageScrollDepth, Math.round(scrolled));
            updateCategory();
        });
    }

    function updateCategory() {
        let { timeSpent, sources, isReturningUser, deviceBrand, pageScrollDepth } = visitorData;
        let category = "Cold";

        let hasOrganicVisit = sources.some(src => ["organic", "direct", "paid search"].includes(src));

        if (
            (timeSpent > 50 &&
                hasOrganicVisit &&
                ["apple", "google", "oneplus", "samsung"].includes(deviceBrand) &&
                pageScrollDepth >= 70) ||
            (timeSpent > 150 && hasOrganicVisit)
        ) {
            category = "Very Hot";
        } else if (
            (timeSpent > 50 && hasOrganicVisit && isReturningUser) ||
            (timeSpent > 100 && isReturningUser) ||
            (timeSpent > 50 && pageScrollDepth >= 75)
        ) {
            category = "Hot";
        } else if (
            (timeSpent > 50 && !isReturningUser) ||
            (timeSpent > 20 && hasOrganicVisit && isReturningUser) ||
            (timeSpent > 20 && pageScrollDepth >= 75)
        ) {
            category = "Warm";
        }

        if (sessionStorage.getItem("visitorCategory") !== category) {
            sessionStorage.setItem("visitorCategory", category);
            console.log("Visitor Category Updated:", category);
        }
    }

    function initVisitorScoring() {
        visitorData.timeSpent = getTotalTimeSpent();
        trackTimeSpent();
        trackScrollDepth();
    }

    initVisitorScoring();
})();
