const { analyzePage } = require("../services/pageAnalyzer");

const auditPage = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "Please enter a website URL."
            });
        }

        const report = await analyzePage(url);

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (err) {

    if (err.message === "INVALID_URL") {
        return res.status(400).json({
            title: "Invalid URL",
            error: "Please enter a valid website URL.",
            explanation:
                "The URL format is incorrect. Example: https://example.com"
        });
    }

    if (err.code === "ENOTFOUND") {
        return res.status(404).json({
            title: "Website Not Found",
            error: "The website could not be found.",
            explanation:
                "The domain doesn't exist or is unreachable."
        });
    }

    if (err.code === "ECONNABORTED") {
        return res.status(408).json({
            title: "Request Timed Out",
            error: "The website took too long to respond.",
            explanation:
                "The server didn't respond within the allowed time."
        });
    }

    if (err.response?.status === 403) {
        return res.status(403).json({
            title: "Analysis Blocked",
            error: "This website blocks automated analysis (HTTP 403).",
            explanation:
                "Many websites protect themselves against bots and automated tools. Because of this, PagePulse cannot access the page HTML for analysis. This is a restriction imposed by the website, not a problem with your URL or this application."
        });
    }

    if (err.response?.status === 404) {
        return res.status(404).json({
            title: "Page Not Found",
            error: "The requested page does not exist.",
            explanation:
                "Check the URL and try again."
        });
    }

    if (err.response?.status >= 500) {
        return res.status(500).json({
            title: "Server Error",
            error: "The website is currently unavailable.",
            explanation:
                "The server encountered an internal error."
        });
    }

    return res.status(500).json({
        title: "Unexpected Error",
        error: "Something went wrong while analyzing the page.",
        explanation:
            "Please try again later."
    });
}
};

module.exports = { auditPage };