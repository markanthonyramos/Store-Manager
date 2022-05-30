import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const Log = () => {
	const [logs, setLogs] = useState([]);

	const [search, setSearch] = useState("");

	const ac = new AbortController();
	const signal = ac.signal;

	const getLogs = async signal => {
		try {
			const response = await fetch("http://localhost:8080/logs", {signal: signal});
			const data = await response.json();
	
			setLogs(data);	
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (!search) getLogs(signal);

		return () => ac.abort();
	}, [logs]);

	const postLog = async () => {
		const date = prompt("Type a date below", "2021-Jan-01");

		if (date) {
			const body = {date}

			try {
				await fetch("http://localhost:8080/create-log", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(body)
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	const delLog = async (id, date) => {
		const answer = window.confirm(`Are you sure you want to delete ${date}?`);

		if (answer) {
			try {
				await fetch(`http://localhost:8080/delete-log/${id}`, {
					method: "DELETE"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	const searchLogs = async () => {
		try {
			const response = await fetch(`http://localhost:8080/search-logs?date=${search}`);
			const data = await response.json();

			setLogs(data);
		} catch (error) {
			console.error(error);
		}
	}

	return(
		<div className="container">
			<form className="search-bar">
				<input type="search" placeholder="Search logs here..." value={search} onChange={e => setSearch(e.target.value)} onKeyUp={searchLogs} />
				<button type="submit">Search</button>
			</form>
			<div className="card-box">
				{logs.map(log => (
				<div key={log.id}>
					<div className="card-box-header">
						<h3>{log.log_date}</h3>
						<div className="x-del-btn" 	onClick={() => delLog(log.id, log.log_date)}>
							<div>x</div>
						</div>
					</div>
					<Link to={`/log/${log.id}`}>
					<div className="card-box-body">
						<h4>Total Profit: &#8369;{log.total_profit}</h4>
						<h5>Total Sales: &#8369;{log.total_sales}</h5>
					</div>
					</Link>
				</div>
				))}
			</div>
			<div className="add-log">
				<button type="button" onClick={postLog}>Add Log</button>
			</div>
		</div>
	);
}

export default Log;