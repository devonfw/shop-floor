# Devonfw shop floor for OpenShift provisioning

In order to deploy a provisioning environment you only need to:

- Create a new project (or using an existing one)

```bash
oc new-project devonfw-shop-floor
```

- Add anyuid scc to default service account

```bash
oc new-project devonfw-shop-floor
```

- Create all resources in devonfw-shop-floor.yml

```bash
oc create -f devonfw-shop-floor.yml
```
