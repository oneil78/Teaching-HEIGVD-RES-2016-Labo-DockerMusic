FROM node:4.3.1
MAINTAINER Christophe Peretti

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/
EXPOSE 2205

RUN ["npm", "install", "moment", "--save"]
CMD ["node", "/opt/app/auditor.js"]
