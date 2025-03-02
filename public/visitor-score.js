(async function() {
    let score = 0;
    const maxScore = 10;

    // Helper function to add points without exceeding maxScore
    function addPoints(points) {
        score = Math.min(score + points, maxScore);
    }

    // 1️⃣ Check if user is returning or new (Stored in LocalStorage)
    const isReturning = localStorage.getItem("visitedBefore") ? true : false;
    if (isReturning) addPoints(1.5);
    localStorage.setItem("visitedBefore", "true");

    // 2️⃣ Detect Traffic Source
    const referrer = document.referrer.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "";

    const highConversionSources = ["google", "bing", "yahoo", "direct", "paid search"];
    if (highConversionSources.some(source => referrer.includes(source) || utmSource.includes(source))) {
        addPoints(2);
    }

    // 3️⃣ Track Time Spent on Page
    let timeSpent = 0;
    setInterval(() => timeSpent++, 1000);

    window.addEventListener("beforeunload", function() {
        if (timeSpent >= 100) addPoints(2);
        localStorage.setItem("visitorScore", score);
    });

    // 4️⃣ Detect Device Brand
    const deviceBrands = ["iPhone", "Google", "OnePlus", "Samsung"];
    const userAgent = navigator.userAgent;
    if (deviceBrands.some(brand => userAgent.includes(brand))) {
        addPoints(1);
    }

    // 5️⃣ Detect Number of Pages Viewed (Using Session Storage)
    let pagesViewed = parseInt(sessionStorage.getItem("pagesViewed")) || 0;
    pagesViewed++;
    sessionStorage.setItem("pagesViewed", pagesViewed);

    if (pagesViewed > 1) addPoints(1.5);

    // 6️⃣ Detect User Location (Using IP API)
    try {
        let response = await fetch("https://ipapi.co/json/");
        let data = await response.json();
        let highConversionCities = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Pune", "Kolkata", "Hyderabad", "Gurgaon", "Faridabad", "Noida", "Navi Mumbai"];
        
        if (highConversionCities.includes(data.city)) {
            addPoints(1.5);
        }
    } catch (error) {
        console.error("Location detection failed", error);
    }

    // 7️⃣ Detect OS & Device
    if (navigator.platform.includes("Mac") && !/Mobile|Android/.test(navigator.userAgent)) {
        addPoints(0.5);
    }

    // 🔥 Store the final visitor score
    localStorage.setItem("visitorScore", score);
    console.log("Final Visitor Score:", score);

})();
