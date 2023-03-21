import { hydrateRelayEnvironment } from "relay-nextjs";
import { Environment, Network, Store, RecordSource } from "relay-runtime";

export function createClientNetwork() {
  return Network.create(async ({ text: query }, variables) => {
    const response = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    return await response.json();
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === "undefined") return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    });

    hydrateRelayEnvironment(clientEnv);
  }

  return clientEnv;
}
