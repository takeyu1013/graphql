import { createYoga } from "graphql-yoga";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin, { prismaConnectionHelpers } from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import PrismaUtils from "@pothos/plugin-prisma-utils";

import type PrismaTypes from "@pothos/plugin-prisma/generated";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin, RelayPlugin, PrismaUtils],
  prisma: {
    client: prisma,
  },
  relayOptions: {
    nodesQueryOptions: false,
    clientMutationId: "optional",
  },
});

const postConnectionHelpers = prismaConnectionHelpers(builder, "Post", {
  cursor: "id",
});
const postConnection = builder.connectionObject({
  type: postConnectionHelpers.ref,
  name: "PostConnection",
});
const UserNode = builder.prismaNode("User", {
  id: { field: "id" },
  fields: (t) => ({
    email: t.exposeString("email"),
    name: t.exposeString("name"),
    posts: t.relatedConnection("posts", { cursor: "id" }, postConnection),
  }),
});

builder.prismaNode("Post", {
  id: { field: "id" },
  fields: (t) => ({
    title: t.exposeString("title"),
    content: t.exposeString("content"),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      type: ["User"],
      resolve: async (query) => prisma.user.findMany({ ...query }),
    }),
  }),
});

builder.relayMutationField(
  "UserCreate",
  {
    inputFields: (t) => ({
      name: t.string({ required: true }),
      email: t.string({ required: true }),
    }),
  },
  {
    resolve: async (_root, args) => {
      const {
        input: { name, email },
      } = args;
      const user = await prisma.user.create({
        data: { name, email },
      });
      return { user };
    },
  },
  {
    outputFields: (t) => ({
      user: t.field({ type: UserNode, resolve: ({ user }) => user }),
    }),
  }
);

builder.mutationType({});

export const schema = builder.toSchema();

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
