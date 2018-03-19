# Host: localhost  (Version: 5.5.53)
# Date: 2018-03-19 16:39:01
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Data for table "options"
#

REPLACE INTO `options` (`id`,`name`,`value`) VALUES (1,'sendEmail','{\n    host: \'smtp.163.com\',\n    user: \'aaa@163.com\',\n    pass: \'123456\',\n    from: \'backupemail\'\n  }'),(2,'receiveEmail','carlleton@vcandou.com'),(3,'pageSize','10'),(4,'needAuth','[\n    \'/api/posts/add\',\n    \'/api/posts/update\',\n    \'/api/posts/del\',\n    \'/api/cates/add\',\n    \'/api/cates/update\',\n    \'/api/cates/del\'\n  ]'),(5,'backupfolder','out');
