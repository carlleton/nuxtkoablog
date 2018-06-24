var options = `REPLACE INTO options (id,name,value) VALUES (1,'sendEmail','{\"host\":\"smtp.163.com\",\"user\":\"abc@163.com\",\"pass\":\"123456\",\"from\":\"abc@163.com\"}'),(2,'receiveEmail','carlleton@vcandou.com'),(3,'backupfolder','out'),(4,'lastBackupTime','1521532035744'),(5,'backupRate','day'),{6,'maxusn','0'};`
var users = `REPLACE INTO users (id,username,password,role,email) VALUES (1,'admin','7c4a8d09ca3762af61e59520943dc26494f8941b',1,NULL);`

module.exports = {
  options,
  users
}
