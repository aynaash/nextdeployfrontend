import * as enums from "../types/enums";
export declare namespace awsx {
}
export declare namespace cloudtrail {
}
export declare namespace ec2 {
    /**
     * Configuration for a VPC subnet spec.
     */
    interface ResolvedSubnetSpec {
        /**
         * An optional list of CIDR blocks to assign to the subnet spec for each AZ. If specified, the count must match the number of AZs being used for the VPC, and must also be specified for all other subnet specs.
         */
        cidrBlocks?: string[];
        /**
         * The netmask for the subnet's CIDR block. This is optional, the default value is inferred from the `cidrMask`, `cidrBlocks` or based on an even distribution of available space from the VPC's CIDR block after being divided evenly by availability zone.
         */
        cidrMask?: number;
        /**
         * The subnet's name. Will be templated upon creation.
         */
        name?: string;
        /**
         * Optional size of the subnet's CIDR block - the number of hosts. This value must be a power of 2 (e.g. 256, 512, 1024, etc.). This is optional, the default value is inferred from the `cidrMask`, `cidrBlocks` or based on an even distribution of available space from the VPC's CIDR block after being divided evenly by availability zone.
         */
        size?: number;
        /**
         * The type of subnet.
         */
        type: enums.ec2.SubnetType;
    }
}
export declare namespace ecr {
}
export declare namespace ecs {
}
export declare namespace lb {
}
