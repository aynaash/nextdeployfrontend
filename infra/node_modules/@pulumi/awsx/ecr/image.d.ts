import * as pulumi from "@pulumi/pulumi";
import * as enums from "../types/enums";
/**
 * Builds a docker image and pushes to the ECR repository
 */
export declare class Image extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Image.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Image;
    /**
     * Unique identifier of the pushed image
     */
    readonly imageUri: pulumi.Output<string>;
    /**
     * Create a Image resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ImageArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Image resource.
 */
export interface ImageArgs {
    /**
     * An optional map of named build-time argument variables to set during the Docker build.  This flag allows you to pass built-time variables that can be accessed like environment variables inside the `RUN` instruction.
     */
    args?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
    /**
     * The version of the Docker builder.
     */
    builderVersion?: enums.ecr.BuilderVersion;
    /**
     * Images to consider as cache sources
     */
    cacheFrom?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Path to a directory to use for the Docker build context, usually the directory in which the Dockerfile resides (although dockerfile may be used to choose a custom location independent of this choice). If not specified, the context defaults to the current working directory; if a relative path is used, it is relative to the current working directory that Pulumi is evaluating.
     */
    context?: pulumi.Input<string>;
    /**
     * dockerfile may be used to override the default Dockerfile name and/or location.  By default, it is assumed to be a file named Dockerfile in the root of the build context.
     */
    dockerfile?: pulumi.Input<string>;
    /**
     * Custom name for the underlying Docker image resource. If omitted, the image tag assigned by the provider will be used
     */
    imageName?: pulumi.Input<string>;
    /**
     * Custom image tag for the resulting docker image. If omitted a random string will be used
     */
    imageTag?: pulumi.Input<string>;
    /**
     * The architecture of the platform you want to build this image for, e.g. `linux/arm64`.
     */
    platform?: pulumi.Input<string>;
    /**
     * ID of the ECR registry in which to store the image.  If not provided, this will be inferred from the repository URL)
     */
    registryId?: pulumi.Input<string>;
    /**
     * Url of the repository
     */
    repositoryUrl: pulumi.Input<string>;
    /**
     * The target of the dockerfile to build
     */
    target?: pulumi.Input<string>;
}
