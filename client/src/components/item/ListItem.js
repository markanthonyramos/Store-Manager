import {useState} from "react";
import {Link} from "react-router-dom";

const ListItem = ({items}) => {
	const [search, setSearch] = useState("");
	const [searchedItems, setSearchedItems] = useState([]);

	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState("");
	const [srp, setSrp] = useState("");
	const [profit, setProfit] = useState("");
	const [price, setPrice] = useState("");

	const setInitialState = () => {
		setName("");
		setQuantity("");
		setSrp("");
		setProfit("");
		setPrice("");
	}

	const postItem = async e => {
		e.preventDefault();
		setInitialState();

		const body = {
			name,
			quantity,
			srp,
			profit,
			price
		}
		try {
			await fetch("http://localhost:8080/create-item", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body)
			});
		} catch (error) {
			console.error(error);
		}
	}

	const delItem = async (id, name) => {
		const answer = window.confirm(`Are you sure you want to delete ${name}?`);

		if (answer) {
			try {
				await fetch(`http://localhost:8080/delete-item/${id}`, {
					method: "DELETE"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	const searchItems = async () => {
		try {
			const response = await fetch(`http://localhost:8080/search-items?name=${search}`);
			const data = await response.json();

			setSearchedItems(data);
		} catch (error) {
			console.error(error);
		}
	}

	const renderItems = itemsParam => {
		return itemsParam.map(item => (
			<div key={item.id}>
				<div className="card-box-header">
					<h3>{item.name}</h3>
					<div className="x-del-btn" onClick={() => delItem(item.id, item.name)}>
						<div>x</div>
					</div>
				</div>
				<Link to={`/item/${item.id}`}>
				<div className="card-box-body">
					<h4>Quantity: {item.quantity === 1 ? `${item.quantity}pc.` : `${item.quantity}pcs.`}</h4>
					<h4>SRP: &#8369;{item.srp}</h4>
					<h4>Profit: &#8369;{item.profit}</h4>
					<h4>Price: &#8369;{item.price}</h4>
				</div>
				</Link>
			</div>
		));
	}

	return(
		<div className="container">
			<form className="search-bar">
				<input type="search" placeholder="Search items here..." value={search} onChange={e => setSearch(e.target.value)} onKeyUp={searchItems} />
				<button type="submit">Search</button>
			</form>
			<div className="card-box">
				{search ? renderItems(searchedItems) : renderItems(items)}
			</div>
			<form className="item-form" onSubmit={postItem}>
				<input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
				<input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
				<input type="number" placeholder="SRP" value={srp} onChange={e => setSrp(e.target.value)} />
				<input type="number" placeholder="Profit" value={profit} onChange={e => setProfit(e.target.value)} />
				<input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
				<button type="submit" className="add-item-btn">Add</button>
			</form>
		</div>
	);
}

export default ListItem;