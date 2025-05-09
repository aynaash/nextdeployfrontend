import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface S3MetricChange extends cloudwatch.MetricChange {
        /**
         * Optional bucket to filter metrics down to.
         */
        bucket?: aws.s3.Bucket;
        /**
         * This dimension filters the data that you have stored in a bucket by the following types
         * of storage:
         *
         * * StandardStorage - The number of bytes used for objects in the STANDARD storage class.
         * * IntelligentTieringAAStorage - The number of bytes used for objects in the Archive
         *   Access tier of INTELLIGENT_TIERING storage class.
         * * IntelligentTieringDAAStorage - The number of bytes used for objects in the Deep
         *   Archive Access tier of INTELLIGENT_TIERING storage class.
         * * IntelligentTieringFAStorage - The number of bytes used for objects in the Frequent
         *   Access tier of INTELLIGENT_TIERING storage class.
         * * IntelligentTieringIAStorage - The number of bytes used for objects in the Infrequent
         *   Access tier of INTELLIGENT_TIERING storage class.
         * * StandardIAStorage - The number of bytes used for objects in the Standard-Infrequent
         *   Access (STANDARD_IA) storage class. This extra data is necessary to identify and
         *   restore your object. You are charged GLACIER rates for this additional storage.
         * * StandardIASizeOverhead - The number of bytes used for objects smaller than 128 KB in
         *   size in the STANDARD_IA storage class.
         * * IntAAObjectOverhead - For each object in INTELLIGENT_TIERING storage class in the
         *   Archive Access tier, GLACIER adds 32 KB of storage for index and related metadata.
         *   This extra data is necessary to identify and restore your object. You are charged
         *   GLACIER rates for this additional storage.
         * * IntAAS3ObjectOverhead - For each object in INTELLIGENT_TIERING storage class in the
         *   Archive Access tier, Amazon S3 uses 8 KB of storage for the name of the object and
         *   other metadata. You are charged STANDARD rates for this additional storage.
         * * IntDAAObjectOverhead - For each object in INTELLIGENT_TIERING storage class in the
         *   Deep Archive Access tier, GLACIER adds 32 KB of storage for index and related
         *   metadata. This extra data is necessary to identify and restore your object. You are
         *   charged S3 Glacier Deep Archive storage rates for this additional storage.
         * * IntDAAS3ObjectOverhead - For each object in INTELLIGENT_TIERING storage class in the
         *   Deep Archive Access tier, Amazon S3 adds 8 KB of storage for index and related
         *   metadata. This extra data is necessary to identify and restore your object. You are
         *   charged STANDARD rates for this additional storage.
         * * OneZoneIAStorage - The number of bytes used for objects in the OneZone-Infrequent
         *   Access (ONEZONE_IA) storage class.
         * * OneZoneIASizeOverhead - The number of bytes used for objects smaller than 128 KB in
         *   size in the ONEZONE_IA storage class.
         * * ReducedRedundancyStorage - The number of bytes used for objects in the Reduced
         *   Redundancy Storage (RRS) class.
         * * GlacierStorage - The number of bytes used for objects in the GLACIER storage class.
         * * GlacierStagingStorage - The number of bytes used for parts of Multipart objects
         *   before the CompleteMultipartUpload request is completed on objects in the GLACIER
         *   storage class.
         * * GlacierObjectOverhead - For each archived object, GLACIER adds 32 KB of storage for
         *   index and related metadata. This extra data is necessary to identify and restore
         *   your object. You are charged GLACIER rates for this additional storage.
         * * GlacierS3ObjectOverhead - For each object archived to GLACIER , Amazon S3 uses 8 KB
         *   of storage for the name of the object and other metadata. You are charged STANDARD
         *   rates for this additional storage.
         * * DeepArchiveStorage - The number of bytes used for objects in the S3 Glacier Deep
         *   Archive storage class.
         * * DeepArchiveObjectOverhead - For each archived object, S3 Glacier Deep Archive adds
         *   32 KB of storage for index and related metadata. This extra data is necessary to
         *   identify and restore your object. You are charged S3 Glacier Deep Archive rates
         *   for this additional storage.
         * * DeepArchiveS3ObjectOverhead - For each object archived to S3 Glacier Deep Archive,
         *   Amazon S3 uses 8 KB of storage for the name of the object and other metadata. You
         *   are charged STANDARD rates for this additional storage.
         * * DeepArchiveStagingStorage – The number of bytes used for parts of Multipart objects
         *   before the CompleteMultipartUpload request is completed on objects in the S3
         *   Glacier Deep Archive storage class.
         * * AllStorageTypes - All available storage types, used by NumberOfObjects metric
         *
         * For more information, see
         * [Metrics-and-dimensions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/metrics-dimensions.html).
         */
        storageType?: "StandardStorage" | "IntelligentTieringAAStorage" | "IntelligentTieringDAAStorage" | "IntelligentTieringFAStorage" | "IntelligentTieringIAStorage" | "StandardIAStorage" | "StandardIASizeOverhead" | "IntAAObjectOverhead" | "IntAAS3ObjectOverhead" | "IntDAAObjectOverhead" | "IntDAAS3ObjectOverhead" | "OneZoneIAStorage" | "OneZoneIASizeOverhead" | "ReducedRedundancyStorage" | "GlacierStorage" | "GlacierStagingStorage" | "GlacierObjectOverhead" | "GlacierS3ObjectOverhead" | "DeepArchiveStorage" | "DeepArchiveObjectOverhead" | "DeepArchiveS3ObjectOverhead" | "DeepArchiveStagingStorage" | "AllStorageTypes";
        /**
         * This dimension filters metrics configurations that you specify for request metrics on a
         * bucket, for example, a prefix or a tag. You specify a filter id when you create a metrics
         * configuration. For more information, see
         * [Metrics-Configurations-for-Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/metrics-configurations.html).
         */
        filterId?: string;
    }
    /**
     * The amount of data in bytes stored in a bucket in the STANDARD storage class,
     * INTELLIGENT_TIERING storage class, Standard - Infrequent Access (STANDARD_IA) storage class,
     * OneZone - Infrequent Access (ONEZONE_IA), Reduced Redundancy Storage (RRS) class, or Glacier
     * (GLACIER) storage class. This value is calculated by summing the size of all objects in the
     * bucket (both current and noncurrent objects), including the size of all parts for all
     * incomplete multipart uploads to the bucket.
     *
     * Units: Bytes
     *
     * Valid statistics: Average
     */
    function bucketSizeBytes(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The total number of objects stored in a bucket for all storage classes except for the GLACIER
     * storage class. This value is calculated by counting all objects in the bucket (both current
     * and noncurrent objects) and the total number of parts for all incomplete multipart uploads to
     * the bucket.
     *
     * Units: Count
     *
     * Valid statistics: Average
     */
    function numberOfObjects(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The total number of HTTP requests made to an Amazon S3 bucket, regardless of type. If you're
     * using a metrics configuration with a filter, then this metric only returns the HTTP requests
     * made to the objects in the bucket that meet the filter's requirements.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function allRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP GET requests made for objects in an Amazon S3 bucket. This doesn't include
     * list operations.
     *
     * Note: Paginated list-oriented requests, like List Multipart Uploads, List Parts, Get Bucket
     * Object versions, and others, are not included in this metric.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function getRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP PUT requests made for objects in an Amazon S3 bucket.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function putRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP DELETE requests made for objects in an Amazon S3 bucket. This also
     * includes Delete Multiple Objects requests. This metric shows the number of requests, not the
     * number of objects deleted.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function deleteRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP HEAD requests made to an Amazon S3 bucket.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function headRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP POST requests made to an Amazon S3 bucket.
     *
     * Note: Delete Multiple Objects and SELECT Object Content requests are not included in this
     * metric.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function postRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of Amazon S3 SELECT Object Content requests made for objects in an Amazon S3
     * bucket.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function selectRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of bytes of data scanned with Amazon S3 SELECT Object Content requests in an
     * Amazon S3 bucket.
     *
     * Units: Bytes
     *
     * Valid statistics: Average (bytes per request), Sum (bytes per period), Sample Count, Min, Max
     */
    function selectScannedBytes(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of bytes of data returned with Amazon S3 SELECT Object Content requests in an
     * Amazon S3 bucket.
     *
     * Units: Bytes
     *
     * Valid statistics: Average (bytes per request), Sum (bytes per period), Sample Count, Min, Max
     */
    function selectReturnedBytes(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP requests that list the contents of a bucket.
     *
     * Units: Count
     *
     * Valid statistics: Sum
     */
    function listRequests(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number bytes downloaded for requests made to an Amazon S3 bucket, where the response
     * includes a body.
     *
     * Units: Bytes
     *
     * Valid statistics: Average (bytes per request), Sum (bytes per period), Sample Count, Min, Max
     */
    function bytesDownloaded(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number bytes uploaded that contain a request body, made to an Amazon S3 bucket.
     *
     * Units: Bytes
     *
     * Valid statistics: Average (bytes per request), Sum (bytes per period), Sample Count, Min, Max
     */
    function bytesUploaded(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * he number of HTTP 4xx client error status code requests made to an Amazon S3 bucket with a
     * value of either 0 or 1. The average statistic shows the error rate, and the sum statistic
     * shows the count of that type of error, during each period.
     *
     * Units: Count
     *
     * Valid statistics: Average (reports per request), Sum (reports per period), Min, Max, Sample
     * Count
     */
    function errors4xx(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The number of HTTP 5xx server error status code requests made to an Amazon S3 bucket with a
     * value of either 0 or 1. The average statistic shows the error rate, and the sum statistic
     * shows the count of that type of error, during each period.
     *
     * Units: Count
     *
     * Valid statistics: Average (reports per request), Sum (reports per period), Min, Max, Sample
     * Count
     */
    function errors5xx(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The per-request time from the complete request being received by an Amazon S3 bucket to when
     * the response starts to be returned.
     *
     * Units: Milliseconds
     *
     * Valid statistics: Average, Sum, Min, Max, Sample Count
     */
    function firstByteLatency(change?: S3MetricChange): cloudwatch.Metric;
    /**
     * The elapsed per-request time from the first byte received to the last byte sent to an Amazon
     * S3 bucket. This includes the time taken to receive the request body and send the response
     * body, which is not included in FirstByteLatency.
     *
     * Units: Milliseconds
     *
     * Valid statistics: Average, Sum, Min, Max, Sample Count
     */
    function totalRequestLatency(change?: S3MetricChange): cloudwatch.Metric;
}
