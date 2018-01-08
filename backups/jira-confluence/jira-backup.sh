#!/bin/sh

JIRA_INSTALLATION=/opt/atlassian/jira
JIRA_DATA=/var/atlassian/application-data/jira
JIRA_BACKUP=/media/external/devonfw/backups/jira

MAX_DATA_FILES=30
MAX_ALLFILES_FILES=10


# abort if anything goes wrong...
set -e

# create directories if neccesary
if [ ! -d "$JIRA_BACKUP/allfiles" ]; then 
  mkdir -p "$JIRA_BACKUP/allfiles"
fi

if [ ! -d "$JIRA_BACKUP/data" ]; then 
  mkdir -p "$JIRA_BACKUP/data"
fi

# move al daily backup
mv $JIRA_DATA/export/*.zip $JIRA_BACKUP/data/ 

# remove backups
BACKUPS_NUM=$(ls -1 $JIRA_BACKUP/data | wc -l)

if [[ $(($BACKUPS_NUM - $MAX_DATA_FILES))  -gt 0 ]]; then
  TEXT=$(ls -1tr $JIRA_BACKUP/data | head -n $(($BACKUPS_NUM - $MAX_DATA_FILES)) )
  cd $JIRA_BACKUP/data
  rm $TEXT
fi

# stop jira service, create a backup and start it again
/etc/init.d/jira1 stop

tar -cvpzf $JIRA_BACKUP/allfiles/jira-backup-$(date +%Y-%m-%d-%H%M%S).tar.gz /var/atlassian/application-data/jira /opt/atlassian/jira

/etc/init.d/jira1 start

# remove backups
BACKUPS_NUMM=$(ls -1 $JIRA_BACKUP/allfiles | wc -l)

if [[ $(($BACKUPS_NUMM - $MAX_ALLFILES_FILES))  -gt 0 ]]; then
  TEXT=$(ls -1tr $JIRA_BACKUP/allfiles | head -n $(($BACKUPS_NUMM - $MAX_ALLFILES_FILES)) )
  cd $JIRA_BACKUP/allfiles
  rm $TEXT
fi
