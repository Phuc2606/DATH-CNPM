#Base image: node 18
FROM node:18-alpine AS build

#Set working directory
WORKDIR /app

#Set environment to production
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy all files
COPY . .

#Build the app
RUN npm run build



#Serve app with nginx server
FROM nginx:alpine

#Copy built app to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

#Expose port 80
EXPOSE 80

#Start nginx server
CMD ["nginx", "-g", "daemon off;"]


#docker build -t techshop-frontend .
#docker run -d -p 3000:80 techshop-frontend

