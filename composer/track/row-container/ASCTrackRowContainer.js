import ASCTrackRowContainerBase from "./ASCTrackRowContainerBase";

import "./ASCTrackRowContainer.css";
import {ASUIDropDownContainer} from "../../../components/menu";
import * as React from "react";

export default class ASCTrackRowContainer extends ASCTrackRowContainerBase {
    constructor(props) {
        super(props);
        this.state.clientPosition = null;
        this.cb.onContextMenu = e => this.onContextMenu(e);
        this.cb.onWheel = e => this.onWheel(e);

    }

    // componentDidMount() {
    //     console.log(this.container.current, this.props);
    //     if(this.container.current)
    //         this.container.current.addEventListener('wheel', this.cb.onWheel, { passive: false });
    // }
    //
    // componentWillUnmount() {
    //     if(this.container.current)
    //         this.container.current.removeEventListener('wheel', this.cb.onWheel);
    // }


    render() {
        return <div
                key="row-container"
                className="row-container"
                ref={elm => {
                    elm && elm.addEventListener('wheel', this.cb.onWheel, {passive: false});
                    // TODO: prevent refresh. use sub component for row content
                }}
                tabIndex={0}
                onKeyDown={this.cb.onKeyDown}
                onContextMenu={this.cb.onContextMenu}
                // onWheel={this.cb.onWheel}
            >
                {this.renderRowContent()}
                {this.state.menuOpen ? <ASUIDropDownContainer
                    clientPosition={this.state.clientPosition}
                    key="dropdown"
                    ref={this.dropdown}
                    options={this.cb.options}
                    vertical={true}
                    onClose={e => this.toggleDropDownMenu(e)}
                /> : null}
            </div>
    }


    /** User Input **/

    onWheel(e) {
        e.preventDefault();
        let rowOffset = parseInt(this.state.rowOffset) || 0; // this.getTrackState().rowOffset;
        rowOffset += e.deltaY > 0 ? 1 : -1;
        if(rowOffset < 0)
            rowOffset = 0; // return console.log("Unable to scroll past beginning");

        this.setRowOffset(rowOffset);
        // console.log('onWheel', e.deltaY);
        // this.getComposer().trackerSetRowOffset(this.getTrackName(), newRowOffset)
        // this.getComposer().trackerUpdateSegmentInfo(this.getTrackName());
        // this.getTrackInfo().changeRowOffset(this.getTrackName(), newRowOffset);
    }


    onContextMenu(e) {
        if(e.defaultPrevented || e.altKey)
            return;
        e.preventDefault();
        this.toggleDropDownMenu(e);
    }


}

