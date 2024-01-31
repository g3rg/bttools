import { Table } from "sst/node/table";
import handler from "@bttools/core/handler";
import dynamoDb from "@bttools/core/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body || "{}");

    const params = {
        TableName: Table.Forces.tableName,
        Key: {
            // The attributes of the item to be created
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            forceId: event?.pathParameters?.id, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET forceName = :forceName, description = :description, forceJSON = :forceJSON, updateTime = :updateTime",
        ExpressionAttributeValues: {
            ":forceName": data.forceName || null,
            ":description": data.description || null,
            ":forceJSON": data.forceJSON || null,
            ":updateTime": Date.now(),
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return JSON.stringify({ status: true });
});
