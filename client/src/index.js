import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// import drizzle functions and contract artifact
import { Drizzle } from "drizzle";
import MyStringStore from "./contracts/MyStringStore.json";
import ForkonomicSystem from "./contracts/ForkonomicSystem.json";
import ForkonomicToken from "./contracts/ForkonomicToken.json";

import ScalarEvent from "./contracts/ScalarEvent.json";
import ScalarEventProxy from "./contracts/ScalarEventProxy.json";
import StandardMarket from "./contracts/StandardMarket.json";
// let drizzle know what contracts we want
const options = { contracts: [ForkonomicSystem, MyStringStore, ForkonomicToken, ScalarEventProxy, ScalarEvent, StandardMarket] };

// setup the drizzle store and drizzle
const drizzle = new Drizzle(options);

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));