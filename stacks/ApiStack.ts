import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
    const { table, forceTable } = use(StorageStack);


    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            authorizer: "iam",
            function: {
                bind: [table, forceTable],
            },
        },
        routes: {
            "GET /notes": "packages/functions/src/list.main",
            "GET /notes/{id}": "packages/functions/src/get.main",
            "POST /notes": "packages/functions/src/create.main",
            "PUT /notes/{id}": "packages/functions/src/update.main",
            "DELETE /notes/{id}": "packages/functions/src/delete.main",

            "GET /forces": "packages/functions/src/force/list.main",
            "GET /forces/{id}": "packages/functions/src/force/get.main",
            "POST /forces": "packages/functions/src/force/create.main",
            "PUT /forces/{id}": "packages/functions/src/force/update.main",
            "DELETE /forces/{id}": "packages/functions/src/force/delete.main",
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}