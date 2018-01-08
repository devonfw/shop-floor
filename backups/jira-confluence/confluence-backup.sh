#!/bin/sh

CONFLUENCE_INSTALLATION=/opt/atlassian/confluence
CONFLUENCE_DATA=/var/atlassian/application-data/confluence
CONFLUENCE_BACKUP=/media/external/devonfw/backups/confluence

MAX_DATA_FILES=30
MAX_ALLFILES_FILES=10


# abort if anything goes wrong...
set -e

if [ ! -d "$CONFLUENCE_BACKUP/allfiles" ]; then 
  mkdir -p "$CONFLUENCE_BACKUP/allfiles"
fi

if [ ! -d "$CONFLUENCE_BACKUP/data" ]; then 
  mkdir -p "$CONFLUENCE_BACKUP/data"
fi

# move al daily backup
mv $CONFLUENCE_DATA/backups/*.zip $CONFLUENCE_BACKUP/data/ 

BACKUPS_NUM=$(ls -1 $CONFLUENCE_BACKUP/data | wc -l)

if [[ $(($BACKUPS_NUM - $MAX_DATA_FILES))  -gt 0 ]]; then
  TEXT=$(ls -1tr $CONFLUENCE_BACKUP/data | head -n $(($BACKUPS_NUM - $MAX_DATA_FILES)) )
  cd $CONFLUENCE_BACKUP/data
  rm $TEXT
fi

/etc/init.d/confluence1 stop

tar -cvpzf $CONFLUENCE_BACKUP/allfiles/confluence-backup-$(date +%Y-%m-%d-%H%M%S).tar.gz $CONFLUENCE_INSTALLATION $CONFLUENCE_DATA

/etc/init.d/confluence1 start

BACKUPS_NUMM=$(ls -1 $CONFLUENCE_BACKUP/allfiles | wc -l)

if [[ $(($BACKUPS_NUMM - $MAX_ALLFILES_FILES))  -gt 0 ]]; then
  TEXT=$(ls -1tr $CONFLUENCE_BACKUP/allfiles | head -n $(($BACKUPS_NUMM - $MAX_ALLFILES_FILES)) )
  cd $CONFLUENCE_BACKUP/allfiles
  rm $TEXT
fi
