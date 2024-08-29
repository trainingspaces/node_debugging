FROM node:20.15-alpine3.19

RUN npm i -g nodemon

# Setup the userid and group id to the same user the host machi
ARG UID=1000
ARG GID=1000

# set up the user id and group id to the same user in the host machine.
USER ${UID}:${GID}

WORKDIR /src

EXPOSE 3000
EXPOSE 9229

CMD [ "nodemon", "--inspect", "src/index.ts" ]

