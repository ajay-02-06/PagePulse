const axios = require("axios");
const cheerio = require("cheerio");

const analyzePage = async (url) => {

    // Validate URL
    try {
        new URL(url);
    } catch {
       throw new Error("INVALID_URL");
    }

    const start = Date.now();

    const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
        }
    });

    const responseTime = Date.now() - start;

    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
        throw new Error("URL does not contain HTML");
    }

    const html = response.data;

    const $ = cheerio.load(html);

    // -------- Basic Information --------

    const title = $("title").text().trim() || "No title";

    const metaDescription =
        $('meta[name="description"]').attr("content") ||
        "No meta description";

    const h1Count = $("h1").length;

    const totalImages = $("img").length;

    const missingAltImages = $("img")
        .filter((i, el) => {
            const alt = $(el).attr("alt");
            return !alt || alt.trim() === "";
        })
        .length;

    const bodyText = $("body").text();

    const wordCount = bodyText
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean).length;

    // -------- SEO Score --------

    let seoScore = 0;

    // Title
    if (title !== "No title")
        seoScore += 20;

    // Meta Description
    if (metaDescription !== "No meta description")
        seoScore += 20;

    // H1
    if (h1Count === 1)
        seoScore += 15;
    else if (h1Count > 1)
        seoScore += 10;

    // Images
    if (totalImages === 0) {
        seoScore += 20;
    } else {
        const imagesWithAlt = totalImages - missingAltImages;
        seoScore += Math.round((imagesWithAlt / totalImages) * 20);
    }

    // Content
    if (wordCount >= 300)
        seoScore += 15;
    else if (wordCount >= 150)
        seoScore += 8;

    // Performance
    if (responseTime < 500)
        seoScore += 10;
    else if (responseTime < 1500)
        seoScore += 5;

    seoScore = Math.min(seoScore, 100);

    // -------- SEO Grade --------

    let seoGrade = "A";

    if (seoScore < 90) seoGrade = "B";
    if (seoScore < 80) seoGrade = "C";
    if (seoScore < 70) seoGrade = "D";
    if (seoScore < 60) seoGrade = "F";

    // -------- Performance --------

    let performance = "Excellent";

    if (responseTime >= 500)
        performance = "Good";

    if (responseTime >= 1500)
        performance = "Average";

    if (responseTime >= 3000)
        performance = "Poor";

    // -------- Recommendations --------

    const recommendations = [];

    if (title === "No title")
        recommendations.push("Add a descriptive page title.");

    if (metaDescription === "No meta description")
        recommendations.push("Add a meta description.");

    if (h1Count === 0)
        recommendations.push("Include at least one H1 heading.");

    if (h1Count > 1)
        recommendations.push("Use only one H1 heading.");

    if (missingAltImages > 0)
        recommendations.push(`Add alt text to ${missingAltImages} image(s).`);

    if (wordCount < 300)
        recommendations.push("Increase page content to at least 300 words.");

    if (responseTime > 1500)
        recommendations.push("Improve page loading speed.");

    if (recommendations.length === 0)
        recommendations.push("Excellent! No major SEO issues detected.");

    // -------- Overall Health --------

    let overallHealth = "Excellent";

    if (seoScore < 90)
        overallHealth = "Good";

    if (seoScore < 75)
        overallHealth = "Fair";

    if (seoScore < 60)
        overallHealth = "Poor";

    // -------- Return Report --------

    return {
        status: response.status,

        responseTime,

        performance,

        overallHealth,

        seoScore,

        seoGrade,

        title,

        metaDescription,

        h1Count,

        missingAltImages,

        wordCount,

        recommendations,

        auditedAt: new Date().toISOString()
    };

};

module.exports = { analyzePage };