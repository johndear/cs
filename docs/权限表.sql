SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS t_resource_action;
DROP TABLE IF EXISTS t_action;
DROP TABLE IF EXISTS t_group_role;
DROP TABLE IF EXISTS t_group_user;
DROP TABLE IF EXISTS t_group;
DROP TABLE IF EXISTS t_resource;
DROP TABLE IF EXISTS t_role_resource_action;
DROP TABLE IF EXISTS t_role;
DROP TABLE IF EXISTS t_user;




/* Create Tables */

-- t_action
CREATE TABLE t_action
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	title varchar(20) COMMENT 'title',
	name varchar(20) COMMENT 'name',
	icon varchar(200) COMMENT 'icon',
	description varchar(200) COMMENT 'description',
	create_time datetime COMMENT 'create_time',
	createby varchar(20) COMMENT 'createby',
	modify_time datetime COMMENT 'modify_time',
	modifyby varchar(20) COMMENT 'modifyby',
	deleted tinyint COMMENT 'deleted',
	PRIMARY KEY (id)
) COMMENT = 't_action';


-- t_group
CREATE TABLE t_group
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	name varchar(50) COMMENT 'name',
	description varchar(200) COMMENT 'description',
	create_time datetime COMMENT 'create_time',
	createby varchar(20) COMMENT 'createby',
	modify_time datetime COMMENT 'modify_time',
	modifyby varchar(20) COMMENT 'modifyby',
	deleted tinyint COMMENT 'deleted',
	PRIMARY KEY (id)
) COMMENT = 't_group';


-- t_group_role
CREATE TABLE t_group_role
(
	group_id bigint NOT NULL COMMENT 'group_id',
	role_id bigint NOT NULL COMMENT 'role_id'
) COMMENT = 't_group_role';


-- t_group_user
CREATE TABLE t_group_user
(
	group_id bigint NOT NULL COMMENT 'group_id',
	user_id bigint NOT NULL COMMENT 'user_id'
) COMMENT = 't_group_user';


-- t_resource
CREATE TABLE t_resource
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	name varchar(50) COMMENT 'name',
	code varchar(20) COMMENT 'code',
	url varchar(50) COMMENT 'url',
	create_time datetime COMMENT 'create_time',
	createby varchar(20) COMMENT 'createby',
	modify_time datetime COMMENT 'modify_time',
	modifyby varchar(20) COMMENT 'modifyby',
	deleted tinyint COMMENT 'deleted',
	PRIMARY KEY (id)
) COMMENT = 't_resource';


-- t_resource_action
CREATE TABLE t_resource_action
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	resource_id bigint NOT NULL COMMENT 'resource_id',
	action_id bigint NOT NULL COMMENT 'action_id',
	PRIMARY KEY (id)
) COMMENT = 't_resource_action';


-- t_role
CREATE TABLE t_role
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	name varchar(50) COMMENT 'name',
	is_super tinyint COMMENT 'is_super',
	description varchar(200) COMMENT 'description',
	create_time datetime COMMENT 'create_time',
	createby varchar(20) COMMENT 'createby',
	modify_time datetime COMMENT 'modify_time',
	modifyby varchar(20) COMMENT 'modifyby',
	deleted tinyint COMMENT 'deleted',
	PRIMARY KEY (id)
) COMMENT = 't_role';


-- t_role_resource_action
CREATE TABLE t_role_resource_action
(
	role_id bigint NOT NULL COMMENT 'role_id',
	resource_id bigint COMMENT 'resource_id',
	action_id bigint COMMENT 'action_id'
) COMMENT = 't_role_resource_action';


-- t_user
CREATE TABLE t_user
(
	id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
	user_name varchar(50) COMMENT 'user_name',
	login_name varchar(20) COMMENT 'login_name',
	password varchar(20) COMMENT 'password',
	icon varchar(50) COMMENT 'icon',
	is_admin tinyint COMMENT 'is_admin',
	create_time datetime COMMENT 'create_time',
	createby varchar(20) COMMENT 'createby',
	modify_time datetime COMMENT 'modify_time',
	modifyby varchar(20) COMMENT 'modifyby',
	deleted tinyint COMMENT 'deleted',
	PRIMARY KEY (id)
) COMMENT = 't_user';



/* Create Foreign Keys */

ALTER TABLE t_resource_action
	ADD FOREIGN KEY (action_id)
	REFERENCES t_action (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_group_role
	ADD FOREIGN KEY (group_id)
	REFERENCES t_group (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_group_user
	ADD FOREIGN KEY (user_id)
	REFERENCES t_group (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_resource_action
	ADD FOREIGN KEY (resource_id)
	REFERENCES t_resource (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_group_role
	ADD FOREIGN KEY (role_id)
	REFERENCES t_role (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_role_resource_action
	ADD FOREIGN KEY (role_id)
	REFERENCES t_role (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE t_group_user
	ADD FOREIGN KEY (group_id)
	REFERENCES t_user (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



