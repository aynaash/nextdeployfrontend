import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface BillingMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional Currency dimension
         */
        currency: "USD";
        /**
         * Optional linked Amazon account id
         */
        linkedAccount?: string;
        /**
         * Optional Service this metric should be filtered down to.
         */
        serviceName?: "AmazonCloudWatch" | "AmazonEC2" | "AmazonKinesis" | "AmazonRoute53" | "AmazonS3" | "AmazonSNS" | "AWSCloudTrail" | "AWSCodePipeline" | "AWSConfig" | "AWSDataTransfer" | "awskms" | "AWSLambda" | "AWSMarketplace" | "AWSQueueService" | "AWSSecretsManager" | "awswaf" | "AWSXRay" | "CodeBuild";
    }
    /**
     * EstimatedCharges
     *
     * Units: currency
     * Valid CloudWatch statistics: Average, Maximum (recommended), Minimum
     */
    function estimatedCharges(change?: BillingMetricChange): cloudwatch.Metric;
}
