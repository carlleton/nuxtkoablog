var dropcates = `DROP TABLE IF EXISTS cates;`
var cates = `CREATE TABLE cates (
  id bigint(20) NOT NULL,
  catename varchar(255) DEFAULT NULL,
  pid bigint(20) DEFAULT NULL,
  orderid int(11) DEFAULT NULL,
  path varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;`

var dropnotecates = `DROP TABLE IF EXISTS notecates;`
var notecates = `CREATE TABLE notecates (
  id bigint(20) NOT NULL,
  catename varchar(255) DEFAULT NULL,
  pid bigint(20) DEFAULT NULL,
  orderid int(11) DEFAULT NULL,
  path varchar(255) DEFAULT NULL,
  pidpath varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;
`

var dropnotes = `DROP TABLE IF EXISTS notes;`
var notes = `CREATE TABLE notes (
  id bigint(20) NOT NULL,
  title varchar(255) DEFAULT NULL,
  content text,
  cid bigint(20) DEFAULT NULL,
  addtime bigint(20) DEFAULT NULL,
  updatetime bigint(20) DEFAULT NULL,
  tags varchar(255) DEFAULT NULL,
  postid bigint(20) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=2648 DEFAULT CHARSET=utf8;
`

var dropoptions = `DROP TABLE IF EXISTS options;`
var options = `CREATE TABLE options (
  id bigint(20) NOT NULL,
  name varchar(255) DEFAULT NULL,
  value longtext,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
`

var dropposts = `DROP TABLE IF EXISTS posts;`
var posts = `CREATE TABLE posts (
  id bigint(20) NOT NULL,
  title varchar(255) DEFAULT NULL,
  content text,
  cid bigint(20) DEFAULT NULL COMMENT '分类id',
  noteid bigint(20) DEFAULT NULL,
  status varchar(50) DEFAULT NULL,
  addtime bigint(20) DEFAULT NULL,
  updatetime bigint(20) DEFAULT NULL,
  tags varchar(255) DEFAULT NULL COMMENT '以,来区分',
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
`

var dropusers = `DROP TABLE IF EXISTS users;`
var users = `CREATE TABLE users (
  id bigint(20) NOT NULL,
  username varchar(255) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  role int(11) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
`

var dropusns = `DROP TABLE IF EXISTS usns;`
var usns = `CREATE TABLE usns (
  id bigint(20) NOT NULL,
  tag int(11) DEFAULT NULL,
  tagid bigint(20) DEFAULT NULL,
  usn bigint(20) DEFAULT NULL,
  updatetime bigint(20) DEFAULT NULL,
  state int(11) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`

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
  users,
  dropusns,
  usns
}
