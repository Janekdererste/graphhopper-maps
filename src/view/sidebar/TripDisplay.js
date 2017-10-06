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

  function getDuration(legs) {
    const departureTime = Moment(legs[0].departureTime);
    const arrivalTime = Moment(legs[trip.legs.length - 1].arrivalTime);
    return arrivalTime.diff(departureTime, "minutes");
  }

  return (
    <div className={styles.tripHeader}>
      <div className={styles.tripTime}>
        <span>{getTimeLabel(trip.legs)}</span>
        <span>{getDuration(trip.legs)} min</span>
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
              <Walk key={i} leg={leg} isLastLeg={i === trip.legs.length - 1} />
            );
          case "pt":
            return <Pt key={i} leg={leg} />;
          default:
            return <span>Implement leg type: {leg.type}</span>;
        }
      })}
    </div>
  );
};

const Waypoint = ({ time, label, isLastLeg }) => {
  return (
    <div className={styles.legRow}>
      <div className={styles.legRowLeftColumnContainer}>
        <span className={styles.legRowLeftColumn}>{time}</span>
      </div>
      <div className={styles.legRowDetails}>
        <div className={styles.legDecoration}>
          <div className={styles.waypointCircle} />
          {isLastLeg ? "" : <div className={styles.line} />}
        </div>
        <div className={styles.waypointLabel}>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

const Description = ({ type, description }) => {
  return (
    <div className={styles.legRow}>
      <div className={styles.legRowLeftColumnContainer}>
        <span className={styles.legRowLeftColumn}>{type}</span>
      </div>
      <div className={styles.legRowDetails}>
        <div className={styles.legDecoration}>
          <div className={styles.line} />
        </div>
        <div className={styles.legRowDescription}>{description}</div>
      </div>
    </div>
  );
};

const Walk = ({ leg, isLastLeg }) => {
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

  return (
    <div className={styles.leg}>
      <Waypoint
        time={Moment(leg.departureTime).format("HH:mm")}
        label={findFirstStreetName(leg.instructions)}
        isLastLeg={false}
      />
      <Description
        type={leg.type}
        description={roundDistance(leg.distance) + "m"}
      />
      {isLastLeg ? (
        <Waypoint
          time={Moment(leg.arrivalTime).format("HH:mm")}
          label={findLastStreetName(leg.instructions)}
          isLastLeg={true}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const Pt = ({ leg }) => {
  return (
    <div className={styles.leg}>
      <Waypoint
        time={Moment(leg.departureTime).format("HH:mm")}
        label={leg.stops[0].stop_name}
      />
      <Description
        type={leg.type}
        description={
          getDuration(leg.arrivalTime, leg.departureTime) +
          " min, " +
          leg.stops.length +
          " Stops"
        }
      />
    </div>
  );
};

function getDuration(arrival, departure) {
  return Moment(arrival).diff(Moment(departure), "minutes");
}
