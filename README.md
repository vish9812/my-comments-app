# my-comments-app

NodeJs app using MySql to save and fetch Comments and Likes.
* Save and fetch Comments via REST Apis
* Update Likes via WebSockets
* Render Likes using React

# Running the app

## Client
* Run index.html via VS Code extension -> Live Server

## Server
Use either docker or local

### Docker
* Update client -> utils.js -> ports to 5000
* Run 
```bash
docker-compose up -d
```

### Local
* Update client -> utils.js -> ports to 3000
* Run 
```bash
npm start
```
