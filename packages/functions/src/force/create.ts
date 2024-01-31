import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@bttools/core/handler";
import dynamoDb from "@bttools/core/dynamodb";

export const main = handler(async (event) => {
    let data = {
        guid: "",
        forceName: "",
        description: "",
        createTime: "",
        updateTime: "",
        force: "",
    };

    if (event.body != null) {
        data = JSON.parse(event.body);
    }

    const params = {
        TableName: Table.Forces.tableName,
        Item: {
            // The attributes of the item to be created
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            forceId: uuid.v4(), // A unique uuid
            forceName: data.forceName, // Parsed from request body
            description: data.description,
            forceJSON: data.force,
            createTime: Date.now(), // Current Unix timestamp
            udpateTime: Date.now(),
        },
    };

    await dynamoDb.put(params);

    return JSON.stringify(params.Item);
});