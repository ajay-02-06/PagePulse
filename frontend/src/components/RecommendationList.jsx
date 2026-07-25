function Recommendations({ recommendations = [] }) {

    return (
        <div className="recommendations">

            <h3>💡 Action Items</h3>

            {recommendations.length === 0 ? (

                <p>✅ No issues found.</p>

            ) : (

                <ul>

                    {recommendations.map((item, index) => (

                        <li key={index}>
                            ✅ {item}
                        </li>

                    ))}

                </ul>

            )}

        </div>
    );

}

export default Recommendations;