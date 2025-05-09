import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  StopServiceDeploymentRequest,
  StopServiceDeploymentResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface StopServiceDeploymentCommandInput
  extends StopServiceDeploymentRequest {}
export interface StopServiceDeploymentCommandOutput
  extends StopServiceDeploymentResponse,
    __MetadataBearer {}
declare const StopServiceDeploymentCommand_base: {
  new (
    input: StopServiceDeploymentCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopServiceDeploymentCommandInput,
    StopServiceDeploymentCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: StopServiceDeploymentCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    StopServiceDeploymentCommandInput,
    StopServiceDeploymentCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class StopServiceDeploymentCommand extends StopServiceDeploymentCommand_base {
  protected static __types: {
    api: {
      input: StopServiceDeploymentRequest;
      output: StopServiceDeploymentResponse;
    };
    sdk: {
      input: StopServiceDeploymentCommandInput;
      output: StopServiceDeploymentCommandOutput;
    };
  };
}
