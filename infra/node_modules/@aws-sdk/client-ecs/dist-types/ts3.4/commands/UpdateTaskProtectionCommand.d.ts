import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  UpdateTaskProtectionRequest,
  UpdateTaskProtectionResponse,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface UpdateTaskProtectionCommandInput
  extends UpdateTaskProtectionRequest {}
export interface UpdateTaskProtectionCommandOutput
  extends UpdateTaskProtectionResponse,
    __MetadataBearer {}
declare const UpdateTaskProtectionCommand_base: {
  new (
    input: UpdateTaskProtectionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateTaskProtectionCommandInput,
    UpdateTaskProtectionCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateTaskProtectionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateTaskProtectionCommandInput,
    UpdateTaskProtectionCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateTaskProtectionCommand extends UpdateTaskProtectionCommand_base {
  protected static __types: {
    api: {
      input: UpdateTaskProtectionRequest;
      output: UpdateTaskProtectionResponse;
    };
    sdk: {
      input: UpdateTaskProtectionCommandInput;
      output: UpdateTaskProtectionCommandOutput;
    };
  };
}
