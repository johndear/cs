SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS csos_change_record;
DROP TABLE IF EXISTS csos_customer_skillgroup;
DROP TABLE IF EXISTS csos_customer_schedule;
DROP TABLE IF EXISTS csos_customer;
DROP TABLE IF EXISTS csos_customer_online;
DROP TABLE IF EXISTS csos_dialog;
DROP TABLE IF EXISTS csos_schedule;
DROP TABLE IF EXISTS csos_source;
DROP TABLE IF EXISTS csos_skillgroup;




/* Create Tables */

-- 转单记录表
CREATE TABLE csos_change_record
(
	id bigint COMMENT 'id'
) COMMENT = '转单记录表';


-- 客服表
CREATE TABLE csos_customer
(
	id bigint NOT NULL COMMENT 'id',
	portal_code varchar(100) COMMENT 'portal_code',
	nick_name varchar(100) COMMENT '昵称',
	priority int COMMENT '优先级',
	dept_id bigint COMMENT '部门id',
	customer_id bigint COMMENT '客服id',
	status int COMMENT '状态',
	PRIMARY KEY (id)
) COMMENT = '客服表';


-- 在线客服
CREATE TABLE csos_customer_online
(
	customer_id bigint NOT NULL COMMENT '客服id',
	last_active_time datetime COMMENT '最后在线时间',
	PRIMARY KEY (customer_id)
) COMMENT = '在线客服';


-- 客服班次表
CREATE TABLE csos_customer_schedule
(
	schedule_id bigint NOT NULL COMMENT '班次id',
	customer_id bigint NOT NULL COMMENT '客服id',
	onwork_time datetime COMMENT '上班时间',
	offwork_time datetime COMMENT '下班时间',
	exist_time datetime COMMENT '退出时间',
	rest_timelong bigint COMMENT '小休时长',
	offline_timelong bigint COMMENT '离线时长',
	online_timelong bigint COMMENT '在线时长',
	service_num int COMMENT '服务量',
	change_count int COMMENT '转交次数'
) COMMENT = '客服班次表';


-- 客服技能组表
CREATE TABLE csos_customer_skillgroup
(
	customer_id bigint NOT NULL COMMENT '客服id',
	skillgroup_id bigint NOT NULL COMMENT '技能组id'
) COMMENT = '客服技能组表';


-- 对话表
CREATE TABLE csos_dialog
(
	id bigint COMMENT 'id',
	customer_id bigint COMMENT '客服id',
	status int COMMENT '会话状态',
	source_id bigint COMMENT '埋点id',
	assign_time datetime COMMENT '分配时间',
	response_time datetime COMMENT '响应时长',
	response_count int COMMENT '响应次数'
) COMMENT = '对话表';


-- 班次表
CREATE TABLE csos_schedule
(
	id bigint NOT NULL COMMENT 'id',
	dept_id bigint COMMENT '部门id',
	start_time datetime COMMENT '开始时间',
	end_time datetime COMMENT '结束时间',
	PRIMARY KEY (id)
) COMMENT = '班次表';


-- 技能组表
CREATE TABLE csos_skillgroup
(
	id bigint NOT NULL COMMENT 'id',
	skillgroup_name varchar(100) COMMENT '技能组名称',
	PRIMARY KEY (id)
) COMMENT = '技能组表';


-- 埋点表
CREATE TABLE csos_source
(
	id bigint NOT NULL COMMENT 'id',
	source_name varchar(100) COMMENT '埋点名称',
	skillgroup_id bigint NOT NULL COMMENT '技能组id',
	PRIMARY KEY (id)
) COMMENT = '埋点表';



/* Create Foreign Keys */

ALTER TABLE csos_customer_skillgroup
	ADD FOREIGN KEY (customer_id)
	REFERENCES csos_customer (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE csos_customer_schedule
	ADD FOREIGN KEY (customer_id)
	REFERENCES csos_customer (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE csos_customer_schedule
	ADD FOREIGN KEY (schedule_id)
	REFERENCES csos_schedule (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE csos_customer_skillgroup
	ADD FOREIGN KEY (skillgroup_id)
	REFERENCES csos_skillgroup (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE csos_source
	ADD FOREIGN KEY (skillgroup_id)
	REFERENCES csos_skillgroup (id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



