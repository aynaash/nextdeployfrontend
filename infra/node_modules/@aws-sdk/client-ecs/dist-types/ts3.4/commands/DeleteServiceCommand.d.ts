import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  DeleteServiceRequest,
  DeleteServiceResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteServiceCommandInput extends DeleteServiceRequest {}
export interface DeleteServiceCommandOutput
  extends DeleteServiceResponse,
    __MetadataBearer {}
declare const DeleteServiceCommand_base: {
  new (
    input: DeleteServiceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteServiceCommandInput,
    DeleteServiceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteServiceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteServiceCommandInput,
    DeleteServiceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteServiceCommand extends DeleteServiceCommand_base {
  protected static __types: {
    api: {
      input: DeleteServiceRequest;
      output: DeleteServiceResponse;
    };
    sdk: {
      input: DeleteServiceCommandInput;
      output: DeleteServiceCommandOutput;
    };
  };
}
