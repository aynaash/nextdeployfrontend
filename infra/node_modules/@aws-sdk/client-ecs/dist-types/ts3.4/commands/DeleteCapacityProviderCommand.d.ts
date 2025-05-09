import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  DeleteCapacityProviderRequest,
  DeleteCapacityProviderResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteCapacityProviderCommandInput
  extends DeleteCapacityProviderRequest {}
export interface DeleteCapacityProviderCommandOutput
  extends DeleteCapacityProviderResponse,
    __MetadataBearer {}
declare const DeleteCapacityProviderCommand_base: {
  new (
    input: DeleteCapacityProviderCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteCapacityProviderCommandInput,
    DeleteCapacityProviderCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteCapacityProviderCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteCapacityProviderCommandInput,
    DeleteCapacityProviderCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteCapacityProviderCommand extends DeleteCapacityProviderCommand_base {
  protected static __types: {
    api: {
      input: DeleteCapacityProviderRequest;
      output: DeleteCapacityProviderResponse;
    };
    sdk: {
      input: DeleteCapacityProviderCommandInput;
      output: DeleteCapacityProviderCommandOutput;
    };
  };
}
