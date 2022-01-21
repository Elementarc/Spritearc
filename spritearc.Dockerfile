FROM arctale/nodejs_base
RUN git clone https://github.com/Elementarc/Spritearc.git
WORKDIR /home/Spritearc
RUN npm i
RUN touch .env.local
RUN touch .env
RUN echo "NODE_ENV=production" >> .env
RUN echo "NEXT_PUBLIC_APP_NAME=Spritearc\nNEXT_PUBLIC_BASE_PATH=http://localhost:3000\nNODE_ENV=production\nNEXT_PUBLIC_GOOGLE_ANALYTICS=G-2SEME4F193\nMONGO_DB=mongodb://localhost:27017\nJWT_PRIVATE_KEY=asojdaiusdahd812dhas7dg80712hdasjdaijkdh8d712h01d\nFULL_DOMAIN=http://Spritearc.com\nNEXT_PUBLIC_DOMAIN_NAME=localhost\nEMAIL=arctale.work@gmail.com\nEMAIL_PASSWORD=Jy9ExMo1vdYu9BeKTAQN" >> .env.local
RUN npm run build
CMD npm run dev
