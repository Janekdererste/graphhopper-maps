import React from "react";
import moment from "moment";
import { Waypoint, LegDescription, StopOnLeg, Turn } from "./TripElement.js";

class Leg extends React.Component {
  constructor(props) {
    super(props);
    this._validateProps(props);
    this.state = {
      isCollapsed: true
    };
  }

  _validateProps(props) {
    if (!props.leg) throw Error("Leg component requires property 'leg'");
  }

  _calculateDuration(departure, arrival) {
    return moment(arrival).diff(moment(departure), "minutes");
  }

  _handleLegDescriptionClicked() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  _createLegDetails() {
    const { leg } = this.props;
    let creator = this._createTurn;
    if (leg.type === "pt") creator = this._createStopOnLeg;

    return leg.legDetails.map(detail => {
      return creator(detail);
    });
  }

  _createStopOnLeg(detail) {
    if (detail.additional) {
      return (
        <StopOnLeg
          time={moment(detail.additional).format("HH:mm")}
          name={detail.main}
        />
      );
    }
    return "";
  }

  _createTurn(detail) {
    return <Turn sign={detail.additional} text={detail.main} />;
  }

  render() {
    const { leg, onClick, isLastLeg } = this.props;
    return (
      <div>
        <Waypoint
          time={moment(leg.departureTime).format("HH:mm")}
          name={leg.departureLocation}
        />
        <LegDescription
          type={leg.type}
          onClick={() => this._handleLegDescriptionClicked()}
        >
          <div>
            <span>
              {this._calculateDuration(leg.departureTime, leg.arrivalTime)} min,{" "}
            </span>
            <span>{leg.distance}</span>
          </div>
        </LegDescription>
        {!this.state.isCollapsed ? this._createLegDetails() : ""}
        {isLastLeg ? (
          <Waypoint
            time={moment(leg.arrivalTime).format("HH:mm")}
            name={leg.arrivalLocation}
            isLastLeg={true}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export { Leg };
