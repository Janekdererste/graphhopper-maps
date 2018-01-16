import React from "react";
import moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import { LegMode } from "../../data/Leg.js";
import { WaypointType } from "../../data/Waypoint.js";
import { Leg, PtLeg, WalkLeg } from "./Leg.js";
import { Waypoint, LegDescription, Transfer } from "./TripElement.js";
import SecondaryText from "../components/SecondaryText.js";
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
      {trip.isSelected ? (
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
            })
          }
        >
          <TripHeader trip={trip} />
        </button>
      )}
    </div>
  );
};

const TripHeader = ({ trip }) => {
  return (
    <div className={styles.tripHeader}>
      <div className={styles.tripTime}>
        <span>
          {moment(trip.departureTime).format("HH:mm")} &ndash;{" "}
          {moment(trip.arrivalTime).format("HH:mm")}
        </span>
        <span>{getDuration(trip.departureTime, trip.arrivalTime)} min</span>
      </div>
      <SecondaryText>
        Transfers: {trip.waypoints.length - 2} &ndash; {trip.fare}{" "}
      </SecondaryText>
    </div>
  );
};

const TripDetails = ({ trip }) => {
  function getLeg(leg) {
    switch (leg.type) {
      case LegMode.PT:
        return <PtLeg leg={leg} isLastLeg={false} />;
      default:
        return <Leg leg={leg} isLastLeg={false} />;
    }
  }

  return (
    <div className={styles.tripDetails}>
      {trip.legs.map((leg, i) => {
        return (
          <div key={i}>
            <Waypoint waypoint={trip.waypoints[i]} />
            {getLeg(leg)}
          </div>
        );
      })}
      <Waypoint waypoint={trip.waypoints[trip.waypoints.length - 1]} />
    </div>
  );
};

function getDuration(arrival, departure) {
  return moment(departure).diff(moment(arrival), "minutes");
}
