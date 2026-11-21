# EasyGenerator

Development runs in Docker: the frontend, the API, MongoDB, and Redis. Start them with `dev.sh` from this folder.

The app is at http://localhost:5173. The API is at http://localhost:3000, and its docs are at http://localhost:3000/docs.

## Linux and macOS

```sh
chmod +x dev.sh
./dev.sh
```

Stop the stack with `./dev.sh down`. Any other arguments are passed to Docker Compose.

## Windows

Open Git Bash in this folder and run:

```sh
./dev.sh
```

Stop the stack with `./dev.sh down`.

PowerShell does not include `sh`. To run `sh dev.sh` from PowerShell, add `C:\Program Files\Git\usr\bin` to your user PATH and open a new window.

## Notes

[AI.md](AI.md) records how this project was built and which prompts were used.
