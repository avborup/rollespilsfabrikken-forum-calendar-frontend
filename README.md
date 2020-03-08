# Rollespilsfabrikken's Forum and Calendar frontend

## Using Docker
The repository provides a simple Dockerfile that can be used to run the app. On
Windows, use the following command with Powershell in the project root to build
the image:
```powershell
docker build . -t rfab
```
Then interact with the app using the base command:
```powershell
docker run --rm -it -v ${pwd}:/app -p 8080:8080 rfab <command>
```
Substitute `<command>` with the appropriate command (`npm install`,
`npm run serve`, etc.)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
