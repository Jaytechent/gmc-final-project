// Filename - App.js

import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import { AnimatePresence } from "framer-motion";

const Animated = () => {
	const location = useLocation();
	return (
		<AnimatePresence>
			<Switch
				location={location}
				key={location.pathname}
			>
				<Route
					exact
					path="/"
					component={Home}
				></Route>

				<Route
					exact
					path="/about"
					component={About}
				></Route>
				<Route
					exact
					path="/contact"
					component={Contact}
				></Route>
			</Switch>
		</AnimatePresence>
	);
};

function App() {
	return (
		<div className="App">
			<>
				<Router>
					<Navbar />
					<Animated />
				</Router>
			</>
		</div>
	);
}

export default App;
