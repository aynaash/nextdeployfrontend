import * as pulumi from "@pulumi/pulumi";
/**
 * Pseudo resource representing the default VPC and associated subnets for an account and region. This does not create any resources. This will be replaced with `getDefaultVpc` in the future.
 */
export declare class DefaultVpc extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of DefaultVpc.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is DefaultVpc;
    readonly privateSubnetIds: pulumi.Output<string[]>;
    readonly publicSubnetIds: pulumi.Output<string[]>;
    /**
     * The VPC ID for the default VPC
     */
    readonly vpcId: pulumi.Output<string>;
    /**
     * Create a DefaultVpc resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: DefaultVpcArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a DefaultVpc resource.
 */
export interface DefaultVpcArgs {
}
