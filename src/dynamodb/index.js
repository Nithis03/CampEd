const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });

module.exports.lambda = async (event, context) => {
  console.log(event);

  const date = new Date();

  const tableName = process.env.CAMPED_TABLE;
  const region = process.env.REGION;

  console.log(`table=${tableName} -- region=${region}`);

  aws.config.update({ region });

  if (event.request.userAttributes.email) {

    // -- Write data to DDB
    let ddbParams = {
        Item: {
            'username': {S: event.username},
            'collegeName': {S: event.request.userAttributes['custom:collegeName']},
            'email': {S: event.request.userAttributes.email},
        },
        TableName: tableName
    };

    // Call DynamoDB
    try {
        await ddb.putItem(ddbParams).promise()
        console.log("Success");
    } catch (err) {
        console.log("Error", err);
    }

    console.log("Success: Everything executed correctly");
    context.done(null, event);

} else {
    // the user's email ID is unknown
    console.log("Error: Nothing was written to DDB or SQS");
    context.done(null, event);
}
};
