import React from "react";
import moment from "moment";
import Dispatcher from "../../data/Dispatcher.js";
import { RouteActionType } from "../../data/RouteStore.js";
import { Leg } from "./Leg.js";
import { Waypoint, LegDescription } from "./TripElement.js";
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
            })}
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
          {moment(trip.departureTime).format("HH:mm")} -{" "}
          {moment(trip.arrivalTime).format("HH:mm")}
        </span>
        <span>{getDuration(trip.departureTime, trip.arrivalTime)} min</span>
      </div>
      <span>Transfers {trip.transfers}</span>
    </div>
  );
};

const TripDetails = ({ trip }) => {
  return (
    <div className={styles.tripDetails}>
      {trip.legs.map((leg, i) => {
        return <Leg leg={leg} isLastLeg={i === trip.legs.length - 1} key={i} />;

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

function getDuration(arrival, departure) {
  return moment(departure).diff(moment(arrival), "minutes");
}
