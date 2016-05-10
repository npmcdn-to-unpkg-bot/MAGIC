mongo --eval 'db.dropDatabase();' ds051720.mlab.com:51720/database_awesome -u eronning -p password
mongoimport -h ds051720.mlab.com:51720 -d database_awesome -c users -u eronning -p password --file backups/users.json
