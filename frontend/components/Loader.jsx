import React from "react";

function Loader({ text = "Loading..." }) {
    return (
        <div className="app-loader">
            <div className="loader-spinner"></div>
            <p>{text}</p>
        </div>
    );
}

export default Loader;