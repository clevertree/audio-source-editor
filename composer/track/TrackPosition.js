import * as React from "react";

import "./assets/TrackerPosition.css";

class TrackPosition extends React.Component {
    render() {
        return <div className="asct-position">{this.props.positionTicks}</div>;
    }
}

export default TrackPosition;