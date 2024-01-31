import { Table } from "sst/node/table";
import handler from "@bttools/core/handler";
import dynamoDb from "@bttools/core/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: Table.Forces.tableName,
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            forceId: event?.pathParameters?.id, // The id of the note from the path
        },
    };

    await dynamoDb.delete(params);

    return JSON.stringify({ status: true });
});