var dropcates = `DROP TABLE IF EXISTS cates;`
var cates = `CREATE TABLE cates (
  id int(11) NOT NULL AUTO_INCREMENT,
  catename varchar(255) DEFAULT NULL,
  pid int(11) DEFAULT NULL,
  orderid int(11) DEFAULT NULL,
  path varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;`

var dropnotecates = `DROP TABLE IF EXISTS notecates;`
var notecates = `CREATE TABLE notecates (
  id int(11) NOT NULL AUTO_INCREMENT,
  catename varchar(255) DEFAULT NULL,
  pid int(11) DEFAULT NULL,
  orderid int(11) DEFAULT NULL,
  path varchar(255) DEFAULT NULL,
  pidpath varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;`

var dropnotes = `DROP TABLE IF EXISTS notes;`
var notes = `CREATE TABLE notes (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  content text,
  cid int(11) DEFAULT NULL,
  addtime bigint(20) DEFAULT NULL,
  updatetime bigint(20) DEFAULT NULL,
  tags varchar(255) DEFAULT NULL,
  postid int(11) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=2641 DEFAULT CHARSET=utf8;`

var dropoptions = `DROP TABLE IF EXISTS options;`
var options = `CREATE TABLE options (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  value longtext,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;`

var dropposts = `DROP TABLE IF EXISTS posts;`
var posts = `CREATE TABLE posts (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  content text,
  cid int(11) DEFAULT NULL COMMENT '分类id',
  noteid int(11) DEFAULT NULL,
  status varchar(50) DEFAULT NULL,
  addtime bigint(20) DEFAULT NULL,
  updatetime bigint(20) DEFAULT NULL,
  tags varchar(255) DEFAULT NULL COMMENT '以,来区分',
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;`

var dropusers = `DROP TABLE IF EXISTS users;`
var users = `CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(255) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  role int(11) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`

module.exports = {
  dropcates,
  cates,
  dropnotecates,
  notecates,
  dropnotes,
  notes,
  dropoptions,
  options,
  dropposts,
  posts,
  dropusers,
  users
}
