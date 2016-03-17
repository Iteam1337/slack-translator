FROM iteamdev/node-test-modules

COPY package.json /

WORKDIR /

RUN npm install --production
COPY / /

# Start application
CMD npm run -s start

# Expose port
EXPOSE 80
