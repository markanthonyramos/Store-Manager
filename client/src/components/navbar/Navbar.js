import {Link} from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
	return(
		<div className="navbar">
			<div>
				<h1>Lorem</h1>
			</div>
			<div>
				<ul className="links">
					<li><Link to="/logs">Logs</Link></li>
					<li><Link to="/items">Items</Link></li>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;