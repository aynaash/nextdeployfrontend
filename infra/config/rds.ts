
import * as aws from "@pulumi/aws";

export function createPostgresDB(vpc: aws.ec2.Vpc) {
  const dbPassword = pulumi.config.requireSecret("dbPassword")
  const subnetGroup = new aws.rds.SubnetGroup("nextdeploy-db-subnet-group", {
    subnetIds: vpc.publicSubnetIds,
  });
  const db = new aws.rds.Instance("nextdeploy-db", {
    instanceClass: "db.t3.micro",
    allocatedStorage: 20,
    engine: "postgres",
    engineVersion: "15",
    name: "nextdeploy",
    username: "admin",
    password: dbPassword,
    dbSubnetGroupName: subnetGroup.name,
    skipFinalSnapshot: true,
    publiclyAccessible: true,
  });

  return db;
}
