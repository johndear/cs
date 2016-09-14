/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.1.68-community : Database - mysql
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mysql` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `mysql`;

/*Table structure for table `tb_action` */

DROP TABLE IF EXISTS `tb_action`;

CREATE TABLE `tb_action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `actionName` varchar(255) DEFAULT NULL,
  `ename` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `resourceAction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tb_action` */

/*Table structure for table `tb_group` */

DROP TABLE IF EXISTS `tb_group`;

CREATE TABLE `tb_group` (
  `id` bigint(20) DEFAULT NULL COMMENT 'id',
  `group_name` varchar(50) DEFAULT NULL COMMENT '组名'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tb_group';

/*Data for the table `tb_group` */

insert  into `tb_group`(`id`,`group_name`) values (1,'super?'),(2,'admin');

/*Table structure for table `tb_group_role` */

DROP TABLE IF EXISTS `tb_group_role`;

CREATE TABLE `tb_group_role` (
  `group_id` bigint(20) DEFAULT NULL COMMENT 'group_id',
  `role_id` bigint(20) DEFAULT NULL COMMENT 'role_id'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tb_group_role';

/*Data for the table `tb_group_role` */

insert  into `tb_group_role`(`group_id`,`role_id`) values (1,1),(1,2),(2,2);

/*Table structure for table `tb_resource` */

DROP TABLE IF EXISTS `tb_resource`;

CREATE TABLE `tb_resource` (
  `id` bigint(20) DEFAULT NULL COMMENT 'id',
  `app_id` bigint(20) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL COMMENT '资源名称',
  `code` varchar(50) DEFAULT NULL COMMENT '资源编码',
  `url` varchar(100) DEFAULT NULL COMMENT '资源url',
  `actions` varchar(500) DEFAULT NULL COMMENT '资源初始化操作（用；隔开）',
  `deleted` int(1) DEFAULT NULL COMMENT 'deleted',
  `create_time` date DEFAULT NULL COMMENT 'create_time',
  `createby` varchar(10) DEFAULT NULL COMMENT 'createby',
  `update_time` date DEFAULT NULL COMMENT 'update_time',
  `update_by` varchar(10) DEFAULT NULL COMMENT 'update_by',
  `authActions` varchar(255) DEFAULT NULL,
  `pId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tb_resource';

/*Data for the table `tb_resource` */

insert  into `tb_resource`(`id`,`app_id`,`name`,`code`,`url`,`actions`,`deleted`,`create_time`,`createby`,`update_time`,`update_by`,`authActions`,`pId`) values (1,1,'系统配置','system',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0),(2,1,'资源管理','resource',NULL,'add:添加,edit:编辑,delete:删除',NULL,NULL,NULL,NULL,NULL,NULL,1),(3,1,'角色管理','role',NULL,'add:添加,',NULL,NULL,NULL,NULL,NULL,NULL,1),(4,1,'组管理','group',NULL,'add:添加,',NULL,NULL,NULL,NULL,NULL,NULL,1),(5,1,'人员管理','user',NULL,'remove:删除,',NULL,NULL,NULL,NULL,NULL,NULL,1);

/*Table structure for table `tb_role` */

DROP TABLE IF EXISTS `tb_role`;

CREATE TABLE `tb_role` (
  `id` bigint(20) DEFAULT NULL COMMENT 'id',
  `role_name` varchar(50) DEFAULT NULL COMMENT '角色名称',
  `memo` varchar(100) DEFAULT NULL COMMENT '备注',
  `is_super` int(1) DEFAULT NULL COMMENT '是否超级管理员'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tb_role';

/*Data for the table `tb_role` */

insert  into `tb_role`(`id`,`role_name`,`memo`,`is_super`) values (1,'超级管理员',NULL,1),(2,'普通管理员',NULL,0);

/*Table structure for table `tb_role_resource_action` */

DROP TABLE IF EXISTS `tb_role_resource_action`;

CREATE TABLE `tb_role_resource_action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_id` bigint(20) DEFAULT NULL COMMENT 'role_id',
  `resource_id` bigint(20) DEFAULT NULL COMMENT 'resource_id',
  `resource_action` varchar(200) DEFAULT NULL COMMENT '资源授权操作（用；隔开）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1 COMMENT='tb_role_resource_action';

/*Data for the table `tb_role_resource_action` */

insert  into `tb_role_resource_action`(`id`,`role_id`,`resource_id`,`resource_action`) values (30,2,1,NULL),(31,2,3,'add'),(32,2,4,NULL),(33,2,5,'remove'),(34,1,1,NULL),(35,1,2,'add,edit'),(36,1,3,'add'),(37,1,4,'add'),(38,1,5,'remove');

/*Table structure for table `tb_user` */

DROP TABLE IF EXISTS `tb_user`;

CREATE TABLE `tb_user` (
  `id` bigint(20) DEFAULT NULL COMMENT 'id',
  `login_name` varchar(20) DEFAULT NULL COMMENT '登陆名',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(20) DEFAULT NULL COMMENT '密码',
  `age` bigint(20) DEFAULT NULL COMMENT '年龄',
  `sex` varchar(2) DEFAULT NULL COMMENT '性别',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `salt` varchar(50) DEFAULT NULL COMMENT 'salt',
  `email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='tb_user';

/*Data for the table `tb_user` */

insert  into `tb_user`(`id`,`login_name`,`user_name`,`password`,`age`,`sex`,`birthday`,`salt`,`email`) values (1,'super','超级管理员','super',NULL,NULL,NULL,NULL,NULL),(2,'admin','普通管理员','admin',NULL,NULL,NULL,NULL,NULL),(3,'user','用户','user',NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `tb_user_group` */

DROP TABLE IF EXISTS `tb_user_group`;

CREATE TABLE `tb_user_group` (
  `id` bigint(20) DEFAULT NULL COMMENT 'id',
  `user_id` bigint(20) DEFAULT NULL COMMENT 'user_id',
  `group_id` bigint(20) DEFAULT NULL COMMENT 'group_id'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tb_user_group';

/*Data for the table `tb_user_group` */

insert  into `tb_user_group`(`id`,`user_id`,`group_id`) values (1,1,1),(1,2,2);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
