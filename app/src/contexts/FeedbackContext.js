import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: () => {},
    setFeedbackFromError: () => {},
    setShouldRefresh: () => {}
});

export default FeedbackContext;