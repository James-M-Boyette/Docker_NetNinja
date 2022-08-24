# Docker-Net-Ninja-

### This repo follows an introductory [tutorial](https://github.com/iamshaunjp/docker-crash-course) series by [netninja](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7) for [Docker](https://www.docker.com/).

### What you'll find here:
- My [notes](https://github.com/sou7hernsaint/Docker-Net-Ninja-/blob/main/NOTES.md) from the series 
- Dockerfile(s), .dockerignore(s), and a docker-compose.yaml file
- Simple front and back end applications to be used in conjunction with Docker (essentially for demo and testing purposes only)

### How to interact with this repo:
- If you'd like to run both front and back end containers, clone this repo locally and run `docker-compose up` at the root of the project. Then, open two internet browser tabs and navigate to [localhost:3000](http://localhost:3000) and [localhost:4000](http://localhost:4000) (the React front end, and Node API back end, respectively). If all goes well, you should see a simple listing of blog posts in the first and a json object in the second. 
- If you'd like to test out the Dockerfiles, use the commands I've listed in the "Working with Docker console" section of my [notes](https://github.com/sou7hernsaint/Docker-Net-Ninja-/blob/main/NOTES.md#7-starting--stopping-containers) to create/update/delete images, containers and volumes

### Why'd I do the tutorial?
- At my last company, they used docker-compose files extensively, and I had no prior exposure to them. I learned the syntax, how to use Docker's desktop application, and how to implement the company's images and containers within their broader ecosystem (in the monorepo, in GCloud, etc.) as best I could. I did so on-the-fly, but really hated how lost I felt the whole time. This is my study project, and I plan to use what I've learned in any applicable future projects (I'm especially excited to attempt to implement Docker on my main personal project 😁😎😁!)
