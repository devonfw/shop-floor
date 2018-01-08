# Backup Jira & Confluence

1. Configure database backup in Jira & Confluence:
    1.  https://confluence.atlassian.com/adminjiraserver/automating-jira-application-backups-938847675.html
    2. https://confluence.atlassian.com/doc/configuring-backups-138348.html

2. Copy scripts at /etc/cron.daily/ or /etc/cron.weekly. 
```
$ cp jira-backup.sh /etc/cron.daily/jira
$ chown root:root /etc/cron.daily/jira
$ chmod 700 /etc/cron.daily/jira
```