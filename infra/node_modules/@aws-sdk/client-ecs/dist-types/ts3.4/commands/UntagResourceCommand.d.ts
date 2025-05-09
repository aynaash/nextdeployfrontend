import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  UntagResourceRequest,
  UntagResourceResponse,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface UntagResourceCommandInput extends UntagResourceRequest {}
export interface UntagResourceCommandOutput
  extends UntagResourceResponse,
    __MetadataBearer {}
declare const UntagResourceCommand_base: {
  new (
    input: UntagResourceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UntagResourceCommandInput,
    UntagResourceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UntagResourceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UntagResourceCommandInput,
    UntagResourceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UntagResourceCommand extends UntagResourceCommand_base {
  protected static __types: {
    api: {
      input: UntagResourceRequest;
      output: {};
    };
    sdk: {
      input: UntagResourceCommandInput;
      output: UntagResourceCommandOutput;
    };
  };
}
