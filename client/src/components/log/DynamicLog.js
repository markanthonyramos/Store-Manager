import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

const DynamicLog = ({items}) => {
	const {id} = useParams();

	const [loggedItems, setLoggedItems] = useState([]);

	const [search, setSearch] = useState("");
	const [searchedItems, setSearchedItems] = useState([]);

	const [totalProfit, setTotalProfit] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

	const ac = new AbortController();
	const signal = ac.signal;

	const getLoggedItems = async signal => {
		try {
			const response = await fetch(`http://localhost:8080/log/${id}`, {signal: signal});
			const data = await response.json();
				
			setLoggedItems(data);

			if (data.length !== 0) {
				setTotalProfit(data[0].total_profit);
				setTotalPrice(data[0].total_price);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getLoggedItems(signal);

		return () => ac.abort();
	}, [loggedItems]);

	const searchItems = async () => {
		try {
			const response = await fetch(`http://localhost:8080/search-items?name=${search}`);
			const data = await response.json();

			setSearchedItems(data);
		} catch (error) {
			console.error(error);
		}
	}

	const delLoggedItem = async idParam => {
		try {
			await fetch(`http://localhost:8080/delete-logged-item/${idParam}`, {
				method: "DELETE"
			});
		} catch (error) {
			console.error(error);
		}
	}

	const addItem = async idParam => {
		const body = {
			logId: id, 
			itemId: idParam
		}

		try {
			await fetch("http://localhost:8080/add-item", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body)
			})
		} catch (error) {
			console.error(error);
		}
	}

	const renderItems = itemsParam => {
		return itemsParam.map(item => (
			<div key={item.id}>
				<div className="card-box-header">
					<h3>{item.name}</h3>
					<div>
						<button className="add-item-btn" onClick={() => addItem(item.id)}>Add</button>
					</div>
				</div>
				<div className="card-box-body">
					<h4>Quantity: {item.quantity === 1 ? `${item.quantity}pc.` : `${item.quantity}pcs.`}</h4>
					<h4>SRP: &#8369;{item.srp}</h4>
					<h4>Profit: &#8369;{item.profit}</h4>
					<h4>Price: &#8369;{item.price}</h4>
				</div>
			</div>
		));
	}

	return(
		<div className="container">
			<form className="search-bar">
				<input type="search" placeholder="Search items to add here..." value={search} onChange={e => setSearch(e.target.value)} onKeyUp={searchItems} />
				<button type="submit">Search</button>
			</form>
			<div className="card-box">
				{search ? renderItems(searchedItems) : renderItems(items)}
			</div>
			<table className="logged-item">
				<thead>
					<tr>
						<th>Name</th>
						<th>Profit</th>
						<th>Price</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{loggedItems.map(loggedItem => (
						<tr key={loggedItem.id}>
							<td>{loggedItem.name}</td>
							<td>&#8369;{loggedItem.profit}</td>
							<td>&#8369;{loggedItem.price}</td>
							<td className="del-logged-item"><button onClick={() => delLoggedItem(loggedItem.id)}>Delete</button></td>
						</tr>
					))}
					<tr>
						<td>Total:</td>
						<td>&#8369;{totalProfit}</td>
						<td>&#8369;{totalPrice}</td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default DynamicLog;