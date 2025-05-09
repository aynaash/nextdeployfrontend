import * as pulumi from "@pulumi/pulumi";
import * as pulumiDocker from "@pulumi/docker";
/**
 * Manages the lifecycle of a docker image in a registry. You can upload images to a registry (= `docker push`) and also delete them again. In contrast to [`awsx.ecr.Image`](/registry/packages/awsx/api-docs/ecr/image/), this resource does not require to build the image, but can be used to push an existing image to an ECR repository. The image will be pushed whenever the source image changes or is updated.
 *
 * ## Example Usage
 * ### Pushing an image to an ECR repository
 *
 * ```typescript
 * import * as pulumi from "@pulumi/pulumi";
 * import * as awsx from "@pulumi/awsx";
 *
 * const repository = new awsx.ecr.Repository("repository", { forceDelete: true });
 *
 * const preTaggedImage = new awsx.ecr.RegistryImage("registry-image", {
 *   repositoryUrl: repository.url,
 *   sourceImage: "my-awesome-image:v1.0.0",
 * });
 * ```
 */
export declare class RegistryImage extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of RegistryImage.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RegistryImage;
    /**
     * The underlying RegistryImage resource.
     */
    readonly image: pulumi.Output<pulumiDocker.RegistryImage>;
    /**
     * Create a RegistryImage resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RegistryImageArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a RegistryImage resource.
 */
export interface RegistryImageArgs {
    /**
     * If `true`, the verification of TLS certificates of the server/registry is disabled. Defaults to `false`
     */
    insecureSkipVerify?: pulumi.Input<boolean>;
    /**
     * If true, then the Docker image won't be deleted on destroy operation. If this is false, it will delete the image from the docker registry on destroy operation. Defaults to `false`
     */
    keepRemotely?: pulumi.Input<boolean>;
    /**
     * The URL of the repository (in the form aws_account_id.dkr.ecr.region.amazonaws.com/repositoryName).
     */
    repositoryUrl: pulumi.Input<string>;
    /**
     * The source image to push to the registry.
     */
    sourceImage: pulumi.Input<string>;
    /**
     * The tag to use for the pushed image. If not provided, it defaults to `latest`.
     */
    tag?: pulumi.Input<string>;
    /**
     * A map of arbitrary strings that, when changed, will force the `docker.RegistryImage` resource to be replaced. This can be used to repush a local image
     */
    triggers?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
}
