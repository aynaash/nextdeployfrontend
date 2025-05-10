import * as aws from "@pulumi/aws";
import { createVpc } from "./config/networking";
import { createVolume } from "./config/storage";
import { createPostgresDB } from "./config/rds";
import { createBucket } from "./config/s3";
import { createFrontendAndBackendServers } from "./config/ec2";
const servers = await createFrontendAndBackendServers(vpc);

export const frontendIP = servers.frontend.publicIp;
export const backendIP = servers.backend.publicIp;
const vpc = createVpc();
const volume = createVolume(ec2);
const db = createPostgresDB(vpc);
const bucket = createBucket();
