# Pull in the Node.js and Linux versions we've specified ...
FROM node:17-alpine

# Declare a working directory to be used for all subsequent commands ...
WORKDIR /api

# Copy various files from our project folder to the image's folders ...

# Note: in order to refactor these instructions, we had to add a 'WORKDIR' declaration on line #4 - which allows us to both simplify this instruction (we're now saying "copy those files to the root of the *working directory* / via a *relative* path") and run things like 'npm install' without additional verbosity ...
# COPY . /app/
# ... becomes ...
COPY . .

# Note: initially, this instruction can cause a problem, since it tells Docker to copy all files from 

# Install the package.json's dependancies ...
RUN npm install 

# We insert this before our application command both 
#   to make our Docker file more explicit, and 
#   to help with port mapping later-on ...
EXPOSE 4000

# RUN is a buildtime instruction, and we want to run our app at *runtime* ...
# RUN npm install 
CMD ["node", "app.js"]
# Moreover, any instruction is given within an array as a string ... and any white space is conveyed with a new string (so 'node app.js' becomes ["node", "app.js"])
