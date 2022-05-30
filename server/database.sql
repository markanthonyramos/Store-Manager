create database store_manager;

create table logs(
	id serial primary key,
	log_date date,
	total_profit int,
	total_sales int
);

create table items(
	id serial primary key,
	name varchar(255) unique,
	quantity int,
	srp int,
	profit int,
	price int,
);

create table logs_items(
	id serial primary key,
	log_id int references logs(id) on delete cascade,
	item_id int references items(id) on delete cascade
);