FROM gcr.io/distroless/nodejs22-debian12:latest@sha256:881157f8399d3ab71c54068f148c25296f7f9bee6d36279febad5a6f46f41c2b

ENV NODE_ENV production

COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json .

CMD ["dist/index.js"]
