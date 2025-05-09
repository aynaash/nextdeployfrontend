export declare const BuilderVersion: {
    /**
     * The first generation builder for Docker Daemon.
     */
    readonly BuilderV1: "BuilderV1";
    /**
     * The builder based on moby/buildkit project
     */
    readonly BuilderBuildKit: "BuilderBuildKit";
};
/**
 * The version of the Docker builder
 */
export type BuilderVersion = (typeof BuilderVersion)[keyof typeof BuilderVersion];
export declare const LifecycleTagStatus: {
    /**
     * Evaluate rule against all images
     */
    readonly Any: "any";
    /**
     * Only evaluate rule against untagged images
     */
    readonly Untagged: "untagged";
    /**
     * Only evaluated rule against images with specified prefixes
     */
    readonly Tagged: "tagged";
};
export type LifecycleTagStatus = (typeof LifecycleTagStatus)[keyof typeof LifecycleTagStatus];
