import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
/**
 * <!-- Bug: Type and Name are switched -->
 * Manages the lifecycle of docker image/tag in a registry means it can store one or more version of specific docker images and identified by their tags.
 *
 * ## Example Usage
 *
 * To be able to update an image itself when an updated image arrives.
 *
 * ```typescript
 * import * as pulumi from "@pulumi/pulumi";
 * import * as docker from "@pulumi/docker";
 * import * as process from "process";
 *
 * const helloworld = new docker.RegistryImage("helloworld", {
 *     build: {
 *         context: `${process.cwd()}/absolutePathToContextFolder`,
 *     },
 * });
 * ```
 */
export declare class RegistryImage extends pulumi.CustomResource {
    /**
     * Get an existing RegistryImage resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RegistryImageState, opts?: pulumi.CustomResourceOptions): RegistryImage;
    /**
     * Returns true if the given object is an instance of RegistryImage.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RegistryImage;
    /**
     * Definition for building the image
     */
    readonly build: pulumi.Output<outputs.RegistryImageBuild | undefined>;
    /**
     * If `true`, the verification of TLS certificates of the server/registry is disabled. Defaults to `false`
     */
    readonly insecureSkipVerify: pulumi.Output<boolean | undefined>;
    /**
     * If true, then the Docker image won't be deleted on destroy operation. If this is false, it will delete the image from the docker registry on destroy operation. Defaults to `false`
     */
    readonly keepRemotely: pulumi.Output<boolean | undefined>;
    /**
     * The name of the Docker image.
     */
    readonly name: pulumi.Output<string>;
    /**
     * The sha256 digest of the image.
     */
    readonly sha256Digest: pulumi.Output<string>;
    /**
     * Create a RegistryImage resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: RegistryImageArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RegistryImage resources.
 */
export interface RegistryImageState {
    /**
     * Definition for building the image
     */
    build?: pulumi.Input<inputs.RegistryImageBuild>;
    /**
     * If `true`, the verification of TLS certificates of the server/registry is disabled. Defaults to `false`
     */
    insecureSkipVerify?: pulumi.Input<boolean>;
    /**
     * If true, then the Docker image won't be deleted on destroy operation. If this is false, it will delete the image from the docker registry on destroy operation. Defaults to `false`
     */
    keepRemotely?: pulumi.Input<boolean>;
    /**
     * The name of the Docker image.
     */
    name?: pulumi.Input<string>;
    /**
     * The sha256 digest of the image.
     */
    sha256Digest?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a RegistryImage resource.
 */
export interface RegistryImageArgs {
    /**
     * Definition for building the image
     */
    build?: pulumi.Input<inputs.RegistryImageBuild>;
    /**
     * If `true`, the verification of TLS certificates of the server/registry is disabled. Defaults to `false`
     */
    insecureSkipVerify?: pulumi.Input<boolean>;
    /**
     * If true, then the Docker image won't be deleted on destroy operation. If this is false, it will delete the image from the docker registry on destroy operation. Defaults to `false`
     */
    keepRemotely?: pulumi.Input<boolean>;
    /**
     * The name of the Docker image.
     */
    name?: pulumi.Input<string>;
}
