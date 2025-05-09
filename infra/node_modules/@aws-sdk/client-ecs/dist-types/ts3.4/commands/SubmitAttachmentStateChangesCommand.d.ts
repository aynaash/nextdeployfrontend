import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  SubmitAttachmentStateChangesRequest,
  SubmitAttachmentStateChangesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface SubmitAttachmentStateChangesCommandInput
  extends SubmitAttachmentStateChangesRequest {}
export interface SubmitAttachmentStateChangesCommandOutput
  extends SubmitAttachmentStateChangesResponse,
    __MetadataBearer {}
declare const SubmitAttachmentStateChangesCommand_base: {
  new (
    input: SubmitAttachmentStateChangesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SubmitAttachmentStateChangesCommandInput,
    SubmitAttachmentStateChangesCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: SubmitAttachmentStateChangesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    SubmitAttachmentStateChangesCommandInput,
    SubmitAttachmentStateChangesCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class SubmitAttachmentStateChangesCommand extends SubmitAttachmentStateChangesCommand_base {
  protected static __types: {
    api: {
      input: SubmitAttachmentStateChangesRequest;
      output: SubmitAttachmentStateChangesResponse;
    };
    sdk: {
      input: SubmitAttachmentStateChangesCommandInput;
      output: SubmitAttachmentStateChangesCommandOutput;
    };
  };
}
