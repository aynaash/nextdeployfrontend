
import *  aws from "@pulumi/aws";

export function createVpc() {
  return new aws.ec2.Vpc("nextdeploy-vpc", {
    numberOfAvailabilityZones: 1,
    tags: {
      Project: "NextDeploy",
    },
    subnetSpecs: [
      {
        type: "public",
        name: "nextdeploy-public",
      },
    ],
  });
}


