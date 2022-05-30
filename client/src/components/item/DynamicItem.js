import {useState, useEffect} from "react";
import {useParams, Redirect} from "react-router-dom";

const DynamicItem = () => {
	const {id} = useParams();

	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState("");
	const [srp, setSrp] = useState("");
	const [profit, setProfit] = useState("");
	const [price, setPrice] = useState("");

	const getItem = async () => {
		try {
			const response = await fetch(`http://localhost:8080/item/${id}`);
			const data = await response.json();
	
			if (data.length === 0) {
				return window.location.replace("/items");
			} else {
				setName(data[0].name);
				setQuantity(data[0].quantity);
				setSrp(data[0].srp);
				setProfit(data[0].profit);
				setPrice(data[0].price);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getItem();
	}, []);

	const putItem = (e) => {
		e.preventDefault();

		setName("");
		setQuantity("");
		setSrp("");
		setProfit("");
		setPrice("");

		const body = {
			name,
			quantity,
			srp,
			profit,
			price
		}

		try {
			fetch(`http://localhost:8080/update-item/${id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body)
			});
		} catch (error) {
			console.error(error);
		} finally {
			window.location.href = "/items";
		}
	}

	return(
		<form className="update-item-form" onSubmit={putItem}>
			<label htmlFor="name">Name:</label>
			<input type="text" placeholder="Name" id="name" value={name} onChange={e => setName(e.target.value)} />
			<label htmlFor="quantity">Quantity:</label>
			<input type="number" placeholder="Quantity" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
			<label htmlFor="srp">SRP:</label>
			<input type="number" placeholder="SRP" id="srp" value={srp} onChange={e => setSrp(e.target.value)} />
			<label htmlFor="profit">Profit:</label>
			<input type="number" placeholder="Profit" id="profit" value={profit} onChange={e => setProfit(e.target.value)} />
			<label htmlFor="price">Price:</label>
			<input type="number" placeholder="Price" id="price" value={price} onChange={e => setPrice(e.target.value)} />
			<button type="submit">Save</button>
		</form>
	);
}

export default DynamicItem;