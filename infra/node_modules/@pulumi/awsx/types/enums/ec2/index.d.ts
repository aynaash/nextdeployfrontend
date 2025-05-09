export declare const NatGatewayStrategy: {
    /**
     * Do not create any NAT Gateways. Resources in private subnets will not be able to access the internet.
     */
    readonly None: "None";
    /**
     * Create a single NAT Gateway for the entire VPC. This configuration is not recommended for production infrastructure as it creates a single point of failure.
     */
    readonly Single: "Single";
    /**
     * Create a NAT Gateway in each availability zone. This is the recommended configuration for production infrastructure.
     */
    readonly OnePerAz: "OnePerAz";
};
/**
 * A strategy for creating NAT Gateways for private subnets within a VPC.
 */
export type NatGatewayStrategy = (typeof NatGatewayStrategy)[keyof typeof NatGatewayStrategy];
export declare const SubnetAllocationStrategy: {
    /**
     * Group private subnets first, followed by public subnets, followed by isolated subnets.
     */
    readonly Legacy: "Legacy";
    /**
     * Order remains as specified by specs, allowing gaps where required.
     */
    readonly Auto: "Auto";
    /**
     * Whole range of VPC must be accounted for, using "Unused" spec types for deliberate gaps.
     */
    readonly Exact: "Exact";
};
/**
 * Strategy for calculating subnet ranges from the subnet specifications.
 */
export type SubnetAllocationStrategy = (typeof SubnetAllocationStrategy)[keyof typeof SubnetAllocationStrategy];
export declare const SubnetType: {
    /**
     * A subnet whose hosts can directly communicate with the internet.
     */
    readonly Public: "Public";
    /**
     * A subnet whose hosts can not directly communicate with the internet, but can initiate outbound network traffic via a NAT Gateway.
     */
    readonly Private: "Private";
    /**
     * A subnet whose hosts have no connectivity with the internet.
     */
    readonly Isolated: "Isolated";
    /**
     * A subnet range which is reserved, but no subnet will be created.
     */
    readonly Unused: "Unused";
};
/**
 * A type of subnet within a VPC.
 */
export type SubnetType = (typeof SubnetType)[keyof typeof SubnetType];
