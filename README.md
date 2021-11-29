# VideoStreaming

## Features:
* HLS stream playback with HLS.js and Plyr
* Resumable fileupload with tus
* Convert videos to HLS streams with FFMPEG
* Registration, Login, Password change, Admin user
* Playback progress is saved to localstorage and to database if the user is logged in
* Forwardauth

## Usage
### NFS
A NFS Server is needed before starting the application.

There are NFS server applications for Windows: [WinNFSd](https://github.com/winnfsd/winnfsd), [haneWin NFS server (recommended)](https://www.hanewin.net/nfs-e.htm). 

Configuration for these programs can be found in the `nfs` folder.

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
The webclient can be accessed at `localhost:80`
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
#### Remove everything
```
kubectl delete -f kubernetes/apps
kubectl delete -f kubernetes/databases
kubectl delete -f kubernetes/message-queue
kubectl delete -f kubernetes/volumes
kubectl delete -f kubernetes/config

helm uninstall traefik
```
