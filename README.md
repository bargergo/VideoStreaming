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
## Tulajdonságok:
* HLS stream lejátszás HLS.js és Plyr segítségével
* Folytatható fájl feltöltés a  tus könyvtárral
* Videók konvertálása HLS stream-mé FFmpeg segítségével
* Regisztráció, Bejelentkezés, Jelszómódosítás, Admin felhasználó
* Az előrehaladás lejátszás közben mentésre kerül a localstorage-ba és, ha a felhasználó bejelentkezett, adatbázisba 
* Forwardauth

## Használat
### Követelmények
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* NFS Server
* [Helm](https://helm.sh/docs/intro/install/) (csak a Kubernetes-szel való futtatáshoz)

#### NFS
Léteznek Windows operációs rendszeren futó NFS szerver alkalmazások: [WinNFSd](https://github.com/winnfsd/winnfsd), [haneWin NFS server (recommended)](https://www.hanewin.net/nfs-e.htm). Ezekhez az alkalmazásokhoz az `nfs` mappában található konfiguráció. Egy létező mappa szükséges az NFS szerver használatához. Ha megváltoztatod az útvonalat, ami a mappára mutat, akkor át kell írnod az `.env` fájlban és a `kubernetes/config/secrets.yaml` fájlban is. Használj kisbetűket a problémák elkerüléséhez
### Docker Compose
Fordítás
```
docker-compose build
```
Elindítás
```
docker-compose up
```
Megállítás
```
docker-compose down
```
A webes kliens a `localhost:80` címen érhető el, a Traefik műszerfal pedig a `localhost:8080` címen.
### Kubernetes
#### Traefik
A Helm chart beszerzése
```
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm repo update
```
Telepítés
```
helm install traefik traefik/traefik --set ports.web.nodePort=32080 --set service.type=NodePort
```
A műszerfal és a belépési pont proxy-zása
```
kubectl port-forward $(kubectl get pods --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000 8000:8000
```
#### A secrets indítása
```
kubectl apply -f kubernetes/config
```
#### A volume-ok, adatbázisok és az üzenetsor indítása
```
kubectl apply -f kubernetes/volumes
kubectl apply -f kubernetes/databases
kubectl apply -f kubernetes/message-queue
```
#### Az alkalmazás fordítása és indítása
```
docker-compose build
kubectl apply -f kubernetes/apps
```
A webes kliens a `localhost:8000` címen érhető el, a Traefik műszerfal pedig a `localhost:9000` címen.
#### A konvertálás szolgáltatás skálázása
```
kubectl scale --replicas=3 deployments/convert
```
#### Minden törlése
```
kubectl delete -f kubernetes/apps
kubectl delete -f kubernetes/databases
kubectl delete -f kubernetes/message-queue
kubectl delete -f kubernetes/volumes
kubectl delete -f kubernetes/config

helm uninstall traefik
```
