import * as aws from "@pulumi/aws";

export function createVolume(instance: aws.ec2.Instance) {
  const volume = new aws.ebs.Volume("nextdeploy-volume", {
    availabilityZone: instance.availabilityZone,
    size: 10,
    type: "gp2",
  });

  new aws.ec2.VolumeAttachment("nextdeploy-volume-attach", {
    deviceName: "/dev/sdh",
    instanceId: instance.id,
    volumeId: volume.id,
  });

  return volume;
}
