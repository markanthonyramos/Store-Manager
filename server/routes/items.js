const router = require("express").Router();
const pool = require("../db");

router.post("/create-item", async (req, res) => {
	const {name, quantity, srp, profit, price} = req.body;
	await pool.query(
		"insert into items(name, quantity, srp, profit, price) values($1, $2, $3, $4, $5);", 
		[name, quantity, srp, profit, price]);
});

router.get("/items", async (req, res) => {
	const query = await pool.query("select * from items;");
	res.send(query.rows);
});

router.get("/item/:id", async (req, res) => {
	const {id} = req.params;
	const query = await pool.query("select * from items where id=$1;", [id]);
	res.send(query.rows);
});

router.get("/search-items", async (req, res) => {
	const {name} = req.query;
	const query = await pool.query("select * from items where name ilike $1;", [`%${name}%`]);
	res.send(query.rows);
});

router.put("/update-item/:id", async (req, res) => {
	const {id} = req.params;
	const {name, quantity, srp, profit, price} = req.body;
	await pool.query(
		"update items set name=$1, quantity=$2, srp=$3, profit=$4, price=$5 where id=$6", 
		[name, quantity, srp, profit, price, id]);
});

router.delete("/delete-item/:id", async (req, res) => {
	const {id} = req.params;
	await pool.query("delete from items where id=$1", [id]);
});

module.exports = router;