import * as pulumi from "@pulumi/pulumi";
import { SubnetArgs } from "./subnet";
import { VpcSubnetArgs, VpcSubnetType } from "./vpc";
export interface AvailabilityZoneDescription {
    name: string;
    id: string;
}
export declare function create(resource: pulumi.Resource | undefined, vpcName: string, vpcCidr: string, ipv6CidrBlock: pulumi.Output<string> | undefined, availabilityZones: AvailabilityZoneDescription[], numberOfNatGateways: number, assignGeneratedIpv6CidrBlock: pulumi.Input<boolean>, subnetArgsArray: VpcSubnetArgs[]): VpcTopologyDescription;
export interface VpcTopologyDescription {
    subnets: SubnetDescription[];
    natGateways: NatGatewayDescription[];
    natRoutes: NatRouteDescription[];
}
export interface SubnetDescription {
    type: VpcSubnetType;
    subnetName: string;
    args: SubnetArgs;
    ignoreChanges?: string[];
}
export interface NatGatewayDescription {
    name: string;
    /** index of the public subnet that this nat gateway should live in. */
    publicSubnet: string;
}
export interface NatRouteDescription {
    name: string;
    /** The name of the private subnet that is getting the route */
    privateSubnet: string;
    /** The name of the nat gateway this private subnet is getting a route to. */
    natGateway: string;
}
