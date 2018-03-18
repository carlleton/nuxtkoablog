# Host: localhost  (Version: 5.5.40)
# Date: 2018-03-18 20:04:06
# Generator: MySQL-Front 5.3  (Build 4.120)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "cates"
#

DROP TABLE IF EXISTS `cates`;
CREATE TABLE `cates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catename` varchar(255) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `orderid` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

#
# Structure for table "notecates"
#

DROP TABLE IF EXISTS `notecates`;
CREATE TABLE `notecates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catename` varchar(255) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `orderid` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Structure for table "notes"
#

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `cid` int(11) DEFAULT NULL,
  `addtime` bigint(20) DEFAULT NULL,
  `updatetime` bigint(20) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `postid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2641 DEFAULT CHARSET=utf8;

#
# Structure for table "posts"
#

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `cid` int(11) DEFAULT NULL COMMENT '分类id',
  `noteid` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `addtime` bigint(20) DEFAULT NULL,
  `updatetime` bigint(20) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL COMMENT '以,来区分',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
