# VideoStreaming
[Magyar nyelv](https://github.com/bargergo/VideoStreaming#tulajdons%C3%A1gok)
## Features:
* HLS stream playback with HLS.js and Plyr
* Resumable fileupload with tus
* Convert videos to HLS streams with FFmpeg
* Registration, Login, Password change, Admin user
* Playback progress is saved to localstorage and if the user is logged in, to database 
* Forwardauth

## Usage
### Requirements
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* NFS Server
* [Helm](https://helm.sh/docs/intro/install/) (only for running the app with Kubernetes)

#### NFS
There are NFS server applications for Windows: [WinNFSd](https://github.com/winnfsd/winnfsd), [haneWin NFS server (recommended)](https://www.hanewin.net/nfs-e.htm). Configuration for these programs can be found in the `nfs` folder. An existing folder is needed for the NFS server. If you change the path to the folder, you must also change it in the `.env` file and in the `kubernetes/config/secrets.yaml` file. Use lowercase letters to avoid problems.

### Docker Compose
Build
```
docker-compose build
```
Start
```
docker-compose up
```
Stop
```
docker-compose down
```
The webclient can be accessed at `localhost:80` and the Traefik dashboard at `localhost:8080`
### Kubernetes
#### Traefik
Get Helm chart
```
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm repo update
```
Install
```
helm install traefik traefik/traefik --set ports.web.nodePort=32080 --set service.type=NodePort
```
Proxy the dashboard and the web entrypoint
```
kubectl port-forward $(kubectl get pods --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000 8000:8000
```
#### Start secrets
```
kubectl apply -f kubernetes/config
```
#### Start volumes, databases, message-queue
```
kubectl apply -f kubernetes/volumes
kubectl apply -f kubernetes/databases
kubectl apply -f kubernetes/message-queue
```
#### Build and start applications
```
docker-compose build
kubectl apply -f kubernetes/apps
```
The webclient can be accessed at `localhost:8000` and the Traefik dashboard at `localhost:9000`
#### Scale the convert service
```
kubectl scale --replicas=3 deployments/convert
```
#### Remove everything
```
kubectl delete -f kubernetes/apps
kubectl delete -f kubernetes/databases
kubectl delete -f kubernetes/message-queue
kubectl delete -f kubernetes/volumes
kubectl delete -f kubernetes/config

helm uninstall traefik
```
---
## Tulajdons??gok:
* HLS stream lej??tsz??s HLS.js ??s Plyr seg??ts??g??vel
* Folytathat?? f??jl felt??lt??s a  tus k??nyvt??rral
* Vide??k konvert??l??sa HLS stream-m?? FFmpeg seg??ts??g??vel
* Regisztr??ci??, Bejelentkez??s, Jelsz??m??dos??t??s, Admin felhaszn??l??
* Az el??rehalad??s lej??tsz??s k??zben ment??sre ker??l a localstorage-ba ??s, ha a felhaszn??l?? bejelentkezett, adatb??zisba 
* Forwardauth

## Haszn??lat
### K??vetelm??nyek
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* NFS Server
* [Helm](https://helm.sh/docs/intro/install/) (csak a Kubernetes-szel val?? futtat??shoz)

#### NFS
L??teznek Windows oper??ci??s rendszeren fut?? NFS szerver alkalmaz??sok: [WinNFSd](https://github.com/winnfsd/winnfsd), [haneWin NFS server (recommended)](https://www.hanewin.net/nfs-e.htm). Ezekhez az alkalmaz??sokhoz az `nfs` mapp??ban tal??lhat?? konfigur??ci??. Egy l??tez?? mappa sz??ks??ges az NFS szerver haszn??lat??hoz. Ha megv??ltoztatod az ??tvonalat, ami a mapp??ra mutat, akkor ??t kell ??rnod az `.env` f??jlban ??s a `kubernetes/config/secrets.yaml` f??jlban is. Haszn??lj kisbet??ket a probl??m??k elker??l??s??hez
### Docker Compose
Ford??t??s
```
docker-compose build
```
Elind??t??s
```
docker-compose up
```
Meg??ll??t??s
```
docker-compose down
```
A webes kliens a `localhost:80` c??men ??rhet?? el, a Traefik m??szerfal pedig a `localhost:8080` c??men.
### Kubernetes
#### Traefik
A Helm chart beszerz??se
```
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm repo update
```
Telep??t??s
```
helm install traefik traefik/traefik --set ports.web.nodePort=32080 --set service.type=NodePort
```
A m??szerfal ??s a bel??p??si pont proxy-z??sa
```
kubectl port-forward $(kubectl get pods --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000 8000:8000
```
#### A secrets ind??t??sa
```
kubectl apply -f kubernetes/config
```
#### A volume-ok, adatb??zisok ??s az ??zenetsor ind??t??sa
```
kubectl apply -f kubernetes/volumes
kubectl apply -f kubernetes/databases
kubectl apply -f kubernetes/message-queue
```
#### Az alkalmaz??s ford??t??sa ??s ind??t??sa
```
docker-compose build
kubectl apply -f kubernetes/apps
```
A webes kliens a `localhost:8000` c??men ??rhet?? el, a Traefik m??szerfal pedig a `localhost:9000` c??men.
#### A konvert??l??s szolg??ltat??s sk??l??z??sa
```
kubectl scale --replicas=3 deployments/convert
```
#### Minden t??rl??se
```
kubectl delete -f kubernetes/apps
kubectl delete -f kubernetes/databases
kubectl delete -f kubernetes/message-queue
kubectl delete -f kubernetes/volumes
kubectl delete -f kubernetes/config

helm uninstall traefik
```
