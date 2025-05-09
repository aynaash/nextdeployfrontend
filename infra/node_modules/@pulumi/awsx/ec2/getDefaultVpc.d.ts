import * as pulumi from "@pulumi/pulumi";
/**
 * [NOT YET IMPLEMENTED] Get the Default VPC for a region.
 */
/** @deprecated Waiting for https://github.com/pulumi/pulumi/issues/7583. Use the DefaultVpc resource until resolved. */
export declare function getDefaultVpc(args?: GetDefaultVpcArgs, opts?: pulumi.InvokeOptions): Promise<GetDefaultVpcResult>;
/**
 * Arguments for getting the default VPC
 */
export interface GetDefaultVpcArgs {
}
/**
 * Outputs from the default VPC configuration
 */
export interface GetDefaultVpcResult {
    readonly privateSubnetIds: string[];
    readonly publicSubnetIds: string[];
    /**
     * The VPC ID for the default VPC
     */
    readonly vpcId: string;
}
/**
 * [NOT YET IMPLEMENTED] Get the Default VPC for a region.
 */
/** @deprecated Waiting for https://github.com/pulumi/pulumi/issues/7583. Use the DefaultVpc resource until resolved. */
export declare function getDefaultVpcOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetDefaultVpcResult>;
