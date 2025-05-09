import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { RouteArgs, SubnetOrId, SubnetRouteProvider } from "./subnet";
import { Vpc } from "./vpc";
export declare class NatGateway extends pulumi.ComponentResource implements SubnetRouteProvider {
    readonly natGatewayName: string;
    readonly vpc: Vpc;
    readonly elasticIP: aws.ec2.Eip | undefined;
    readonly natGateway: aws.ec2.NatGateway;
    constructor(name: string, vpc: Vpc, args: NatGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    constructor(name: string, vpc: Vpc, args: ExistingNatGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    route(name: string, opts: pulumi.ComponentResourceOptions): RouteArgs;
}
export interface NatGatewayArgs {
    /**
     * The subnet the NatGateway should be placed in.
     */
    subnet: SubnetOrId;
    /**
     * A mapping of tags to assign to the resource.
     */
    tags?: pulumi.Input<{
        [key: string]: any;
    }>;
}
export interface ExistingNatGatewayArgs {
    natGateway: aws.ec2.NatGateway;
}
