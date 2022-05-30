const router = require("express").Router();
const pool = require("../db");

router.post("/create-log", async (req, res) => {
	const {date} = req.body;
	await pool.query("insert into logs(log_date) values($1);", [date]);
});

router.post("/add-item", async (req, res) => {
	const {logId, itemId} = req.body;
	await pool.query("insert into logs_items(log_id, item_id) values($1, $2);", [logId, itemId]);
});

router.get("/logs", async (req, res) => {
	const query = await pool.query(
		`select
			logs.id,
			logs.log_date,
			SUM(items.profit) as total_profit,
			SUM(items.price) as total_sales
		from
			logs
		left join
			logs_items
			on logs.id = logs_items.log_id
		left join
			items
			on logs_items.item_id = items.id
		GROUP BY
			logs.id
		order by
			logs.id;`
	);
	res.send(query.rows);
});

router.get("/log/:id", async (req, res) => {
	const {id} = req.params;
	const query = await pool.query(
		`select 
			logs_items.id,
			items.name,
			items.profit,
			items.price,
			(select sum(items.profit) from logs_items inner join items on items.id=logs_items.item_id where logs_items.log_id=$1) as total_profit,
			(select sum(items.price) from logs_items inner join items on items.id=logs_items.item_id where logs_items.log_id=$1) as total_price
		from 
			logs_items
		inner join
			items
			on items.id=logs_items.item_id
		where
			logs_items.log_id=$1
		order by
			logs_items.id;`,
		[id]
	);
	res.send(query.rows);
});

router.get("/search-logs", async (req, res) => {
	const {date} = req.query;
	const query = await pool.query(
		`select
			logs.id,
			logs.log_date,
			SUM(items.profit) as total_profit,
			SUM(items.price) as total_sales
		from
			logs
		left join
			logs_items
			on logs.id = logs_items.log_id
		left join
			items
			on logs_items.item_id = items.id
		where
			logs.log_date ilike $1
		GROUP BY
			logs.id
		order by
			logs.id;`, 
		[`%${date}%`]
	);
	res.send(query.rows);
});

router.delete("/delete-log/:id", async (req, res) => {
	const {id} = req.params;
	await pool.query("delete from logs where id=$1", [id]);
});

router.delete("/delete-logged-item/:id", async (req, res) => {
	const {id} = req.params;
	await pool.query("delete from logs_items where id=$1", [id]);
});

module.exports = router;