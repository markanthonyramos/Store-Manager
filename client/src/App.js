import "./App.css";
import Navbar from "./components/navbar/Navbar";
import ListLog from "./components/log/ListLog";
import ListItem from "./components/item/ListItem";
import DynamicLog from "./components/log/DynamicLog";
import DynamicItem from "./components/item/DynamicItem";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import {useEffect, useState} from "react";

function App() {
	const [items, setItems] = useState([]);
	
	const ac = new AbortController();
	const signal = ac.signal;

	const getItems = async signal => {
		try {
			const response = await fetch("http://localhost:8080/items", {signal: signal});
			const data = await response.json();
				
			setItems(data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getItems(signal);

		return () => ac.abort();
	}, [items]);

	return (
		<BrowserRouter>
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/logs" component={ListLog} />
					<Route exact path="/">
						<Redirect to="/logs" />
					</Route>
					<Route path="/items" render={() => <ListItem items={items} />} />
					<Route path="/item/:id" component={DynamicItem} />
					<Route path="/log/:id" render={() => <DynamicLog items={items} />} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
