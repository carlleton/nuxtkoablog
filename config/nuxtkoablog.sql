# Host: localhost  (Version: 5.5.53)
# Date: 2018-02-26 11:27:32
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "cate"
#

DROP TABLE IF EXISTS `cate`;
CREATE TABLE `cate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catename` varchar(255) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "cate"
#

/*!40000 ALTER TABLE `cate` DISABLE KEYS */;
/*!40000 ALTER TABLE `cate` ENABLE KEYS */;

#
# Structure for table "posts"
#

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `cid` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `addtime` bigint(20) DEFAULT NULL,
  `updatetime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "posts"
#

/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

#
# Structure for table "tags"
#

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tagname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "tags"
#

/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "users"
#

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
