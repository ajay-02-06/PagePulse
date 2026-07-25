import ScoreCard from "./ScoreCard";
import Recommendations from "./RecommendationList";

function ReportCard({ report, url }) {

    const hostname = new URL(url).hostname;

    const favicon =
        `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

    const health =
        report.seoScore >= 90
            ? "🟢 Excellent"
            : report.seoScore >= 75
            ? "🟡 Good"
            : report.seoScore >= 60
            ? "🟠 Fair"
            : "🔴 Poor";

    const shortTitle =
        report.title.length > 80
            ? report.title.substring(0, 80) + "..."
            : report.title;

    const shortDescription =
        report.metaDescription.length > 150
            ? report.metaDescription.substring(0, 150) + "..."
            : report.metaDescription;

    const auditTime = new Date(report.auditedAt).toLocaleString();

    return (

        <div className="report">

            <div className="header">

                <img
                    src={favicon}
                    alt="Website Icon"
                />

                <div>

                    <h2>{hostname}</h2>

                    <p className="health">
                        {health}
                    </p>

                </div>

            </div>

            <div className="cards">

                <ScoreCard
                    title="SEO Score"
                    value={`${report.seoScore}/100`}
                />

                <ScoreCard
                    title="Grade"
                    value={report.seoGrade}
                />

                <ScoreCard
                    title="Performance"
                    value={report.performance}
                />

                <ScoreCard
                    title="Words"
                    value={report.wordCount}
                />

            </div>

            <div className="details">

                <h3>📊 Audit Summary</h3>

                <p>
                    <strong>HTTP Status:</strong> {report.status}
                </p>

                <p>
                    <strong>Response Time:</strong> {report.responseTime} ms
                </p>

                <p>
                    <strong>Title:</strong> {shortTitle}
                </p>

                <p>
                    <strong>Meta Description:</strong> {shortDescription}
                </p>

                <p>
                    <strong>H1 Count:</strong> {report.h1Count}
                </p>

                <p>
                    <strong>Missing Alt Images:</strong> {report.missingAltImages}
                </p>

                <p>
                    <strong>Audit Time:</strong> {auditTime}
                </p>

            </div>

            <Recommendations
                recommendations={report.recommendations}
            />

        </div>

    );

}

export default ReportCard;