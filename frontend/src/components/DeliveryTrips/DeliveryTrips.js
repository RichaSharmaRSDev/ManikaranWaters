import { useState } from "react";
import { useSelector } from "react-redux";
import Title from "../layout/Title";
import Navigation from "../Navigation/Navigation";
import MakeTrip from "./MakeTrip";
import EditTrip from "./EditTrip";
import "./DeliveryTrips.scss";

const DeliveryTrips = () => {
  const [activeTab, setActiveTab] = useState("make");
  const { showNavigation } = useSelector((state) => state.navigation);

  return (
    <>
      <Title title="Delivery Trips" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <div className="dt-tabs">
          <button
            className={`dt-tab${activeTab === "make" ? " active" : ""}`}
            onClick={() => setActiveTab("make")}
          >
            Make trip
          </button>
          <button
            className={`dt-tab${activeTab === "edit" ? " active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit trip
          </button>
        </div>

        <div className="dt-content">
          {activeTab === "make" ? (
            <MakeTrip />
          ) : (
            <EditTrip onSwitchTab={setActiveTab} />
          )}
        </div>
      </div>
    </>
  );
};

export default DeliveryTrips;
