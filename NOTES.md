### #1: What is Docker?

- It uses containers to run images in isolated environments …
- Docker's utility lies in its ability to create synchronized development environments:
- If you are developing an application using a specific version of Node.js, and specific versions of other technologies, the image/blueprint will allow everyone on your team to collaborate using the exact same technologies
  > They don't need to go download everything piece by piece (following a check list etc) nor do they run the risk of setting things up incorrectly.
  > They get all dependencies
  > They get all the ENVs automatically
  > They get all set up files
- You could also try new things, with differing technologies etc, using multiple containers (one container uses the old, familiar, tested version of a tech, while the other uses the shiny, new, untested version of some piece of tech) - Unlike Virtual Machines, which require their own, full OS (running on top of the host's OS) - which makes them slower, normally - Docker uses containers that share the host's OS (making it quicker)

### #3: Docker Images …

- Essentially "blueprints" for Docker containers; they have …

  > A Runtime environment
  > Application code
  > Any dependencies
  > Extra config files (ENVs etc)
  > Commands

- When images are run they create unique containers - each of which is …
  > A running instance of said image, and
  > Runs our application
  > Note: they are isolated processes - they run independently form any other processes
- I repeat: you RUN THE IMAGE to MAKE a CONTAINER

### #4: Docker Hub & Parent Images …

- Images have layers, where new things are added incrementally … so the order matters
- The "parent" image normally describes OS (and sometimes the runtime environment)
  > Pre-made versions of these can be found on "Docker Hub"
- Child layers can include copying source code, loading dependences etc
- In order to begin with a pre-made 'parent' image, go to Docker Hub and find the command for the desired image

  > You might want the official Node.js image, for instance, as the parent layer, and would need to run "docker pull node"

  > Note: when I tried to run the command "docker pull node" from the 10TB drive, I got an error; running the same command from C:\ worked as expected

  > Note: if you want a specific version of said technology, you'll need to specify that (using, say "") - Note: When you pull a pre-made image, it'll show in Docker's 'images' tab … you can run this image as-is, and it'll create a new container with a randomly-assigned name

- For any running container, you have several options (within docker's local UI):

  > Stop

  > Restart

  > Delete

  > Enter a console (where you can do OS commmands (Linux etc), Tech commands (Node.js commands etc), etc.)

### #5: Docker Files (and how to make them) …

- At the beginning of this tutorial, a couple of dummy files exist that should be noted by the student:

  > A package.json file (for dependencies)

  > An app.js file (application code)

  - (If you didn't have a Dockerfile to automate things ...) Normally, you'd need to run

    > 'npm install' to execute the package.json, create a node\*modules folder, etc. and then

    > 'node app.js' to start the application code

- To make a Docker file

  - Create a file named "Dockerfile" (with a capital 'D' and no extension). In it, write:
    > The Dockerfile contains instructions for creating an image; note that aside from the first line, how the remainder of the file is set up is up to you - though it'll become clear that proper sequencing will avoid errors and inefficiencies

  1. First line:

     - `FROM node:17-alpine`
       > FROM = "this is the parent image"
       > Node:17 = node version 17
       > -alpine = version of Linux
     - This tells Docker to, before anything else, pull in the Node.js and Linux versions we've specified (note: either from our local installation, or from docker hub, if we're a dev that hasn't added it yet)

  2. Second line:

     - `COPY . .`
       > COPY =
       > '.' = relative path (to the root directory of the app)
       > '.' = relative path in the image
     - This tells Docker to, secondly, copy various files from our project folder to the image
       > If we had file in a "src" folder, this command would be 'COPY /src .'
       > If we wanted to copy everything to a folder in the image called "APP" we'd write 'COPY . /app'
       > (and if we wanted both, we'd do 'COPY ./src /app')

  3. Third line:

     - `RUN npm install`
     - This tells docker to run a given command while the image is being built
       > PROBLEM: this wont work in our case because we've copied our files into the 'app' folder of our image … and therefore need to run 'npm install' in the same folder in order to execute the package.json …
       > SOLN: Add a line before our 'RUN' command

  4. (Inserted) second line (so all other commands can use it):

     - `WORKDIR /app`

  5. Fifth line:

     - `CMD ["node", "app.js"]`
       > (and not RUN …)
     - Why 'CMD' instead of 'RUN' ? Because these first instructions are occurring at \_build time\* … and we want to run app.js at _run time_ … IOW, these are image instructions rather than instructions for a given container (and a container is where we'd run our app)

  6. Fifth (inserted) line:

     - Before we can run our app.js router, we need to expose a port with …
     - `EXPOSE 4000`
     - This tells docker not only to open said port, but also to own it (so our computer doesn't have access to port: 4000 anymore)
       > Note: this isn't strictly necessary, but it makes the Docker file more readable and helps "port mapping" later-on

  - Note: Each of these lines are effectively "layers" in/of the image, starting with the _parent_ `node` + `linux` layer

- In order to build an image from a Dockerfile, run

  - `docker build -t netninja_docker_demo .`
    > Note: here, the '-t netninja_docker_demo' = tag and a name, and the '.' is a relative path for the Dockerfile to be run
  - When you run this command, an image is created and stored for your Docker desktop app …
  - ... Therefore, if you update the Dockerfile and re-run 'docker build …' you will replace the image

    > So if you want to save the old image, give a new name tag

    > And if you want to replace/update the existing one, give it the same tag

  - Ultimately, images are read-only once they're created, so any changes made to code files etc will need to be (re)saved to the existing or a new image.

- "Layer Caching" (video #8)

  - Given that generating new images can be time-consuming and inefficient, Docker can use earlier, cached layers of a pre-existing image in order to create a new one.

  - Example of inefficiency: if you change the application code, layers 3 and 4 _could_ need to be re-run (as well as all other subsequent layers) ... so how do we make this more efficient?

    > We know that neither the first two layers (the working directory nor the runtime environments) were changed, so they could be used as-is. Docker, as it turns out, _does_ use these layers (known as **cached layers** - or those layers unaffected by current staged changes) from previous images to build new ones - which speeds-up Docker's work!

    > Therefore, in order to further re-factor this Dockerfile, we can move the `RUN npm install` command to before the `COPY . .` command (and add a `COPY package.json` before that so it's available to Docker). Now, we avoid building node_modules every time a change to our application code is made!

### #6: .dockerignore

- See `.dockerignore` file for syntax (but it's almost identical to a gitignore file)

### #7 Starting & Stopping Containers

- When you click 'run' for a given image, a set of options for the to-be-generated container appear:

  - Container Name
    > This is similar to Gcloud's 'cloud run instance', where if you do not give a unique name a random one is generated …
  - Ports

    > You need to specify a port even if your container has an exposed port … because (as stated before), your pc hasn't opened this port to outside traffic … only the container is opened to said traffic … so you need to map Local Host

    > You could map 5000 to the container's 4000 … but this can get confusing

    > Q: I wonder what the virtue of mapping is, here … is it a security thing? Where the container, being a self-contained environment, could be set to have no open ports? And therefore sand-box/cut-off the application from the world wide web?

    > Note: Apparently this option is only made available if you run the 'EXPOSE' command (and thus is what he was referencing when he said 'it makes port mapping easier later-on' …

    > You can see what port you've specified for this option in the 'container' window of Docker Desktop (under 'Port(s)')

  - Volumes (addressed in video #\_)
  - ENVs (_never addressed_)

- Working with Docker console …

  - `docker images`
    > … will display all images available
  - `docker run <image name>`
    > … will run a given image
  - `docker run --name <container_name> <image_name>`
    > … allows you to also name the container
  - `docker run --name <container_name> -p 4065:4000 <image_name>`
    > … allows you to map the local host port (the left-hand number) to the container port (the right-hand number)
    > Note: 'p' stands for 'publish' ?
  - `docker run --name <container_name> -p 4065:4000 -d <image_name>`
    > … allows you to run the container in a detached state (without blocking your terminal) - so if you don't want to see console messages and you do want to be able to keep entering commands in the current terminal run this (otherwise, just open a second terminal dedicated to command inputs)
  - `docker ps`
    > … will list the processes (containers) currently running
  - `docker ps -a`
    > … will show all containers (including those not running)
  - `docker stop <container_id>/<container_name>`
    > … will stop the given container from running
  - `docker start <container_id>/<container_name>`

    > … will start a container (without creating it first … like 'docker run' would do) and will run it detached from the console

    > Note: obviously, in this case, you don't need to map any ports etc bc those already exist in the current, given container

  - `docker image rm <image_id>/<image_name>`

    > … will remove an image

    > Note: if an image has been used to create a (currently-existing) container, you can't delete it outright

  - `docker image rm <image_id>/<image_name> -f`

    > … will remove an image _even if it's being used by a container_ ...

  - `docker container rm <image_id>/<image_name>`

    > … will remove a container (so you can run this first, and then remove it's parent image second)

  - Note: you can chain files: `docker container rm <image_id/name #1> <image_id/name #2> <image_id/name #3>`

  - `docker build -t <image_name>:<versoin_number ... or whatever tag you want> .`

    > … will add a tag, and allow you to "version" your image

  - `docker system prune -a`

    > … will remove all images, containers, and all Volumes

- Working with a container (within Docker Desktop) …

  > If you click on a container, you will see any and all log messages generated by your app (and that you'd normally expect to see in terminal)

  > Moreover, every container you make will be listed in docker's 'Containers' window (so it's useful to give your containers 'v1' 'v2' 'v3' etc. suffixes …

  > If you want to open a connection to the container in a browser, there's an icon on the right of said container ("open with browser")

### #10 (Anonymous) Volumes: Syncing Local Changes with Containers

- In the case where you want to develop locally and iteratively, volumes allow you to sync changes between your local code and a container
  > Note: volumes **do not** sync changes to your image. Therefore, you should use volumes to do a bit of work, and _then_ (re)build an image in order to share it with coworkers, etc.
- To establish a volume use the `-v` flag, the absolute path of the source folder, a `:`, and the absolute path of the container's folder
- To de-couple a given folder (so that it _does not_ sync), use the `-v` flag followed only by the absolute path of the container's folder
  > Example (abstract): `docker run --name netninja_docker_demo_v3_nodemon -p 4000:4000 --rm -v <source folder path>:<container folder path> -v /app/node_modules netninja_docker_demo:nodemon`
      - Here,
      - `-v <source folder path>:<container folder path>` defines a volume, or synced connection
      - `-v /app/node_modules` defines an anonymous volume, or a folder etc that won't be synced in the container
      - (also, `--rm` removes the container when it's stopped (so we're not storing the container permanently))
  > Example (literal): `docker run --name netninja_docker_demo_v3_nodemon -p 4000:4000 --rm -v K:\++_Tutorials (Code Files)\+ 4 Databases Libraries & Tools (projects)\Docker\Docker (Net Ninja)\NOTES.md:/app -v /app/node_modules netninja_docker_demo:nodemon`
      - Here, we've protected the container's node_modules folder from any local changes (deletions), and required that module additions etc be pushed to the container manually (via a re-building of the image, etc.)

### #11 Docker Compose

- Obviously, docker commands can get very long and confusing - and one might even want to run multiple containers/projects (MongoDB: database, React: front end, Node: API back end) simultaneously ...
- To begin create a file in the root directory named `docker-compose.yaml`

  > Refer to the file for syntax & layout

  > Note: you can chain multiple containers, as demonstrated in this project's `docker-compose.yaml` file

- To create an image and start its container, run `docker-compose up`
- To stop the container & delete it, run `docker-compose down`
  - ... to also delete the image, run `docker-compose down --rmi all`
    > Here, we've told Docker to remove _all_ images created by this docker-compose file - you can also specify a specific image (if you so desire)
  - ... to also delete all the volumes, run `docker-compose down --rmi all -v`
