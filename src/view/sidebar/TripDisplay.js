import React from "react";
import Moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import styles from "./TripDisplay.css";

export default ({ trips }) => {
  return (
    <div className={styles.tripDisplay}>
      {trips.paths.map((trip, i) => {
        return (
          <Trip
            key={i}
            trip={trip}
            selectedIndex={trips.selectedRouteIndex}
            index={i}
          />
        );
      })}
    </div>
  );
};

const Trip = ({ trip, selectedIndex, index }) => {
  return (
    <div>
      {selectedIndex === index ? (
        <div>
          <TripHeader trip={trip} />
          <TripDetails trip={trip} />
        </div>
      ) : (
        <button
          className={styles.tripToggle}
          onClick={e =>
            Dispatcher.dispatch({
              type: RouteActionType.SELECTED_ROUTE_INDEX,
              value: index
            })}
        >
          <TripHeader trip={trip} />
        </button>
      )}
    </div>
  );
};

const TripHeader = ({ trip }) => {
  function getTimeLabel(legs) {
    const departureTime = Moment(legs[0].departureTime);
    const arrivalTime = Moment(legs[trip.legs.length - 1].arrivalTime);

    let depLabel = departureTime.format("HH:mm");
    let arrLabel = arrivalTime.format("HH:mm");
    return depLabel + " -- " + arrLabel;
  }

  return (
    <div className={styles.tripHeader}>
      <div className={styles.tripTime}>
        <span>{getTimeLabel(trip.legs)}</span>
        <span>
          {getDuration(
            trip.legs[0].departureTime,
            trip.legs[trip.legs.length - 1].arrivalTime
          )}{" "}
          min
        </span>
      </div>
      <span>Transfers {trip.transfers}</span>
    </div>
  );
};

const TripDetails = ({ trip }) => {
  return (
    <div className={styles.tripDetails}>
      {trip.legs.map((leg, i) => {
        switch (leg.type) {
          case "walk":
            return (
              <WalkLeg
                key={i}
                leg={leg}
                isLastLeg={i === trip.legs.length - 1}
              />
            );
          case "pt":
            return <PtLeg key={i} leg={leg} />;
          default:
            return <span>Implement leg type: {leg.type}</span>;
        }
      })}
    </div>
  );
};

const WalkLeg = ({ leg, isLastLeg }) => {
  return (
    <Leg
      leg={leg}
      isLastLeg={isLastLeg}
      waypointName={findFirstStreetName(leg.instructions)}
      lastWaypointName={findLastStreetName(leg.instructions)}
    />
  );
};

class PtLeg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStops: false
    };
  }

  handleToggleButtonClick() {
    this.setState({ showStops: !this.state.showStops });
  }

  render() {
    const legDescription = (
      <button onClick={e => this.handleToggleButtonClick()}>
        <span>{this.props.leg.stops.length} Stops </span>
      </button>
    );
    return (
      <Leg
        leg={this.props.leg}
        isLastLeg={this.props.isLastLeg}
        waypointName={findStopName(this.props.leg.stops)}
        legDescription={legDescription}
      >
        {this.state.showStops ? (
            <div>
              {this.props.leg.stops.map(stop => {
                return (
                  <div key={stop.stop_id}>
                    <TripElement
                      leftColumn={Moment(stop.departureTime).format("HH:mm")}
                      decorationType={TripElementDecorationType.IN_BETWEEN_STOP}
                    >
                      <span>{stop.stop_name}</span>
                    </TripElement>
                  </div>
                );
              })}
            </div>
        ) : (
          ""
        )}
      </Leg>
    );
  }
}

const Leg = ({
  leg,
  isLastLeg = false,
  waypointName,
  legDescription,
  lastWaypointName = "",
  children
}) => {
  return (
    <div className={styles.leg}>
      <Waypoint
        time={Moment(leg.departureTime).format("HH:mm")}
        name={waypointName}
      />
      <LegDescription type={leg.type}>{legDescription}</LegDescription>
      {children}
      {isLastLeg ? (
        <Waypoint
          time={Moment(leg.arrivalTime).format("HH:mm")}
          name={lastWaypointName}
          isLastLeg={true}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const Waypoint = ({ time, name, isLastLeg = false }) => {
  return (
    <TripElement
      leftColumn={time}
      isLastElement={isLastLeg}
      decorationType={TripElementDecorationType.WAYPOINT}
    >
      <span className={styles.waypointName}>{name}</span>
    </TripElement>
  );
};

const LegDescription = ({ type, children }) => {
  return (
    <TripElement
      leftColumn={type}
      isLastElement={false}
      decorationType={TripElementDecorationType.NONE}
    >
      <div className={styles.legRowDescription}>{children}</div>
    </TripElement>
  );
};

const TripElement = ({
  leftColumn,
  children,
  isLastElement,
  decorationType
}) => {
  return (
    <div className={styles.tripElement}>
      <div className={styles.tripElementLeftColumn}>{leftColumn}</div>
      <div className={styles.tripElementContent}>
        <TripElementDecoration
          isLastElement={isLastElement}
          decorationType={decorationType}
        />
        <div className={styles.tripElementDetails}>{children}</div>
      </div>
    </div>
  );
};

const TripElementDecoration = ({ isLastElement, decorationType }) => {
  function getCircle(decorationType) {
    switch (decorationType) {
      case TripElementDecorationType.WAYPOINT:
        return <div className={styles.waypointCircle} />;
      case TripElementDecorationType.IN_BETWEEN_STOP:
        return <div className={styles.waypointCircle} />;
      default:
        return "";
    }
  }

  function getLine(isLastElement) {
    return isLastElement ? "" : <div className={styles.line} />;
  }

  return (
    <div className={styles.tripElementDecoration}>
      {getCircle(decorationType)}
      {getLine(isLastElement)}
    </div>
  );
};

function getDuration(arrival, departure) {
  return Moment(arrival).diff(Moment(departure), "minutes");
}

function roundDistance(distance) {
  return Math.round(distance / 100) * 100;
}

function findFirstStreetName(instructions) {
  let instruction = instructions.find(instruction => {
    return instruction.street_name && instruction.street_name != "";
  });
  return instruction ? instruction.street_name : "somewhere";
}

function findLastStreetName(instructions) {
  let result = "somewhere";

  for (let i = instructions.length - 1; i >= 0; i--) {
    let instruction = instructions[i];
    if (instruction.street_name && instruction.street_name != "") {
      result = instruction.street_name;
      break;
    }
  }
  return result;
}

function findStopName(stops) {
  if (stops && stops.length > 0) return stops[0].stop_name;
  return "";
}

const TripElementDecorationType = {
  WAYPOINT: 0,
  IN_BETWEEN_STOP: 1,
  NONE: 2
};
