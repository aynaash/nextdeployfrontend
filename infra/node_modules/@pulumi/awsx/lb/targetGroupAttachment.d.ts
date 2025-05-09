import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
/**
 * Attach an EC2 instance or Lambda to a Load Balancer. This will create required permissions if attaching to a Lambda Function.
 */
export declare class TargetGroupAttachment extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of TargetGroupAttachment.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is TargetGroupAttachment;
    /**
     * Auto-created Lambda permission, if targeting a Lambda function
     */
    readonly lambdaPermission: pulumi.Output<pulumiAws.lambda.Permission | undefined>;
    /**
     * Underlying Target Group Attachment resource
     */
    readonly targetGroupAttachment: pulumi.Output<pulumiAws.lb.TargetGroupAttachment>;
    /**
     * Create a TargetGroupAttachment resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: TargetGroupAttachmentArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a TargetGroupAttachment resource.
 */
export interface TargetGroupAttachmentArgs {
    /**
     * EC2 Instance to attach to the Target Group. Exactly 1 of [instance], [instanceId], [lambda] or [lambdaArn] must be provided.
     */
    instance?: pulumi.Input<pulumiAws.ec2.Instance>;
    /**
     * ID of an EC2 Instance to attach to the Target Group. Exactly 1 of [instance], [instanceId], [lambda] or [lambdaArn] must be provided.
     */
    instanceId?: pulumi.Input<string>;
    /**
     * Lambda Function to attach to the Target Group. Exactly 1 of [instance], [instanceId], [lambda] or [lambdaArn] must be provided.
     */
    lambda?: pulumi.Input<pulumiAws.lambda.Function>;
    /**
     * ARN of a Lambda Function to attach to the Target Group. Exactly 1 of [instance], [instanceId], [lambda] or [lambdaArn] must be provided.
     */
    lambdaArn?: pulumi.Input<string>;
    /**
     * Target Group to attach to. Exactly one of [targetGroup] or [targetGroupArn] must be specified.
     */
    targetGroup?: pulumi.Input<pulumiAws.lb.TargetGroup>;
    /**
     * ARN of the Target Group to attach to. Exactly one of [targetGroup] or [targetGroupArn] must be specified.
     */
    targetGroupArn?: pulumi.Input<string>;
}
