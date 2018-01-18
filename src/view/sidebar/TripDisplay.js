import React from "react";
import moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import { LegMode } from "../../data/Leg.js";
import { WaypointType } from "../../data/Waypoint.js";
import { Leg, PtLeg, WalkLeg } from "./Leg.js";
import { Waypoint, Arrival, LegDescription } from "./TripElement.js";
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
  const tripTimeClassName = trip.isPossible
    ? styles.tripTime
    : styles.tripTimeImpossible;
  return (
    <div className={styles.tripHeader}>
      <div className={tripTimeClassName}>
        <span>
          {moment(trip.departureTime).format("HH:mm")} &ndash;{" "}
          {moment(trip.arrivalTime).format("HH:mm")}
        </span>

        <span>{trip.durationInMinutes} min</span>
      </div>
      <SecondaryText>
        Transfers: {trip.transfers} &ndash; {trip.fare}{" "}
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

  function getWaypointElement(waypoint) {
    let arrivalElement = "";

    if (
      waypoint.type === WaypointType.INBEETWEEN &&
      waypoint.prevMode === LegMode.PT
    ) {
      arrivalElement = (
        <Arrival
          time={moment(waypoint.arrivalTime).format("HH:mm")}
          delay={waypoint.arrivalDelay}
        />
      );
    }
    return (
      <div>
        {arrivalElement}
        <Waypoint
          name={waypoint.name}
          time={moment(waypoint.departureTime).format("HH:mm")}
          delay={waypoint.departureDelay}
          isPossible={waypoint.isPossible}
        />
      </div>
    );
  }

  function getLastWaypointElement(waypoints) {
    let last = waypoints[waypoints.length - 1];
    return (
      <Waypoint
        time={moment(last.arrivalTime).format("HH:mm")}
        delay={last.arrivalDelay}
        name={last.name}
        isLast={true}
      />
    );
  }

  return (
    <div className={styles.tripDetails}>
      {trip.legs.map((leg, i) => {
        return (
          <div key={i}>
            {getWaypointElement(trip.waypoints[i])}
            {getLeg(leg)}
          </div>
        );
      })}
      {getLastWaypointElement(trip.waypoints)}
    </div>
  );
};
