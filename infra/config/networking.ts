
import * as awsx from "@pulumi/awsx";

export function createVpc() {
  return new awsx.ec2.Vpc("nextdeploy-vpc", {
    numberOfAvailabilityZones: 1,
    subnets: [{ type: "public" }],
  });
}
