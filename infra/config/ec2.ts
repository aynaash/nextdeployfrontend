import * as aws from "@pulumi/aws";

// Ubuntu 22.04 LTS AMI in us-east-1
const ubuntuAmi = aws.ec2.getAmi({
  owners: ["099720109477"], // Canonical
  filters: [{ name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"] }],
  mostRecent: true,
});

export async function createFrontendAndBackendServers(vpc: aws.ec2.Vpc) {
  const ami = await ubuntuAmi;

  const sg = new aws.ec2.SecurityGroup("nextdeploy-sg", {
    vpcId: vpc.id,
    description: "Allow HTTP and SSH",
    ingress: [
      { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
      { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
      { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
  });

  const frontend = new aws.ec2.Instance("nextdeploy-frontend", {
    instanceType: "t2.micro",
    ami: ami.id,
    subnetId: vpc.publicSubnetIds[0],
    associatePublicIpAddress: true,
    securityGroups: [sg.name],
    tags: { role: "frontend" },
  });

  const backend = new aws.ec2.Instance("nextdeploy-backend", {
    instanceType: "t2.micro",
    ami: ami.id,
    subnetId: vpc.publicSubnetIds[1],
    associatePublicIpAddress: true,
    securityGroups: [sg.name],
    tags: { role: "backend" },
  });

  return { frontend, backend };
}
