import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { RouteArgs, SubnetRouteProvider } from "./subnet";
import { Vpc } from "./vpc";
export declare class InternetGateway extends pulumi.ComponentResource implements SubnetRouteProvider {
    readonly vpc: Vpc;
    readonly internetGateway: aws.ec2.InternetGateway;
    constructor(name: string, vpc: Vpc, args: aws.ec2.InternetGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    constructor(name: string, vpc: Vpc, args: ExistingInternetGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    route(name: string, opts: pulumi.ComponentResourceOptions): RouteArgs;
}
export interface ExistingInternetGatewayArgs {
    /**
     * Optional existing instance to use to make the [awsx.ec2.InternetGateway] out of.
     */
    internetGateway: aws.ec2.InternetGateway;
}
