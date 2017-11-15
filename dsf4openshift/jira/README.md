## Steps:

 1. Create project:

 ```
 $ oc new-project jira --display-name="## Jira ##"
 ```

 2. Create the app:




Truco del almendruco:

```
    oc adm policy add-scc-to-user anyuid -z default
    oc edit scc anyuid
```