
import * as aws from "@pulumi/aws";

export function createBucket() {
  const bucket = new aws.s3.Bucket("nextdeploy-assets", {
    acl: "private",
    tags: { env: "dev", project: "nextdeploy" },
  });

  return bucket;
}
