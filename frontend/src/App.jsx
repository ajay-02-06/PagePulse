import { useState } from "react";
import api from "./services/api";
import ReportCard from "./components/ReportCard";

function App() {
    const [url, setUrl] = useState("");
    const [submittedUrl, setSubmittedUrl] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeWebsite = async () => {

        const originalInput = url.trim();
        let formattedUrl = originalInput;

        if (!formattedUrl) {
            setSubmittedUrl(originalInput);
            setReport(null);

            setError({
                title: "Missing URL",
                error: "Please enter a website URL.",
                explanation:
                    "Enter a valid URL such as https://example.com before starting the analysis."
            });

            return;

        }
       if (!formattedUrl.includes(".")) {

    setSubmittedUrl(originalInput);

    setReport(null);

    setError({
        title: "Invalid URL",
        error: "Please enter a valid website URL.",
        explanation:
            "The input is not a valid website address. Example: google.com or https://example.com"
    });

    return;

}
        if (
            !formattedUrl.startsWith("http://") &&
            !formattedUrl.startsWith("https://")
        ) {
            formattedUrl = "https://" + formattedUrl;
        }

        setSubmittedUrl(formattedUrl);

        try {

            setLoading(true);
            setReport(null);
            setError(null);

            const res = await api.post("/audit", {
                url: formattedUrl
            });

            setReport(res.data.data);

        } catch (err) {

            setReport(null);

            setError(

                err.response?.data || {

                    title: "Unexpected Error",

                    error: "Something went wrong.",

                    explanation:
                        "Please try again after a few moments."

                }

            );

        } finally {

            setLoading(false);

        }

    };

    const downloadReport = () => {

        if (!report) return;

        const blob = new Blob(
            [JSON.stringify(report, null, 2)],
            {
                type: "application/json"
            }
        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "audit-report.json";

        link.click();

        URL.revokeObjectURL(link.href);

    };

    const clearError = () => {

        setError(null);

    };

    return (

        <div className="container">

            <div className="hero">

                <h1>🔍 PagePulse</h1>

                <p>

                    Analyze any website's SEO, performance and health in seconds.

                </p>

            </div>

            <div className="searchBox">

                <input

                    type="text"

                    placeholder="https://example.com"

                    value={url}

                    onChange={(e) => setUrl(e.target.value)}

                    onKeyDown={(e) => {

                        if (e.key === "Enter")
                            analyzeWebsite();

                    }}

                />

                <button

                    onClick={analyzeWebsite}

                    disabled={loading}

                >

                    {

                        loading

                            ? "Analyzing..."

                            : "Analyze"

                    }

                </button>

            </div>

            {/* ---------- Error Card ---------- */}

            {

                error && (

                    <div className="errorCard">

                        <div className="errorHeader">

                            <h2>

                                ❌ {error.title}

                            </h2>

                            <p>

                                {error.error}

                            </p>

                        </div>

                        <div className="errorSection">

                            <h3>

                                💡 Why did this happen?

                            </h3>

                            <p>

                                {error.explanation}

                            </p>

                        </div>

                        <div className="errorInfo">

                            <div className="infoCard">

                                <h4>

                                    🌐 Website

                                </h4>

                                <p>

                                    {submittedUrl}

                                </p>

                            </div>

                            <div className="infoCard">

                                <h4>

                                    🕒 Time

                                </h4>

                                <p>

                                    {new Date().toLocaleString()}

                                </p>

                            </div>

                        </div>

                        <button

                            className="retryBtn"

                            onClick={clearError}

                        >

                            Try Another Website

                        </button>

                    </div>

                )

            }

            {/* ---------- Report ---------- */}

            {

                report && (

                    <>

                        <ReportCard

                            report={report}

                            url={submittedUrl}

                        />

                        <button

                            className="downloadBtn"

                            onClick={downloadReport}

                        >

                            📥 Download Report

                        </button>

                    </>

                )

            }

            <footer>

                Built for Digital Heroes Training Task •{" "}

                <a

                    href="https://digitalheroesco.com"

                    target="_blank"

                    rel="noreferrer"

                >

                    Digital Heroes

                </a>

            </footer>

        </div>

    );

}

export default App;