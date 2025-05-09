import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
export declare class Trail extends pulumi.ComponentResource {
    /**
     * The managed CloudWatch Log Group.
     */
    readonly logGroup: aws.cloudwatch.LogGroup | undefined;
    /**
     * The managed S3 Bucket where the Trail will place its logs.
     */
    readonly bucket: aws.s3.Bucket | undefined;
    /**
     * The CloudTrail Trail.
     */
    readonly trail: aws.cloudtrail.Trail;
    /**
     * Create a Trail resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: TrailArgs, opts?: pulumi.CustomResourceOptions);
}
type TrailArgs = utils.Overwrite<aws.cloudtrail.TrailArgs, {
    /**
     * If CloudTrail pushes logs to CloudWatch Logs in addition to S3.
     *
     * Disabled by default to reduce costs.
     *
     * @default false
     */
    sendToCloudWatchLogs?: boolean;
    /**
     * If sendToCloudWatchLogs is enabled, provide the log group configuration.
     */
    cloudWatchLogGroupArgs?: aws.cloudwatch.LogGroupArgs;
    /**
     * Specifies the name of the S3 bucket designated for publishing log files.
     */
    s3BucketName?: pulumi.Input<string>;
}>;
export {};
