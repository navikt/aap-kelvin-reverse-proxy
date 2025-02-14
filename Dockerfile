FROM gcr.io/distroless/nodejs22-debian12:latest@sha256:e36aabe0394465699ebdb68544f6f3b618a654af85f6fa1b55e8fc4e567b3250

ENV NODE_ENV production

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json .

CMD ["dist/index.js"]
