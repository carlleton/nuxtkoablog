var options = `REPLACE INTO options (id,name,value,uid) VALUES (1,'sendEmail','{\"host\":\"smtp.163.com\",\"user\":\"abc@163.com\",\"pass\":\"123456\",\"from\":\"abc@163.com\"}','1'),(2,'receiveEmail','carlleton@vcandou.com','1'),(3,'backupfolder','out','1'),(4,'lastBackupTime','1521532035744','1'),(5,'backupRate','day','1'),(6,'maxusn','0','1');`
var users = `REPLACE INTO users (id,username,password,role,email) VALUES (1,'admin','adminpass',1,NULL);`

module.exports = {
  options,
  users
}
