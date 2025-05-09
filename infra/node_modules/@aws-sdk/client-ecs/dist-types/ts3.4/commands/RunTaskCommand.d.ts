import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import { RunTaskRequest, RunTaskResponse } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface RunTaskCommandInput extends RunTaskRequest {}
export interface RunTaskCommandOutput
  extends RunTaskResponse,
    __MetadataBearer {}
declare const RunTaskCommand_base: {
  new (input: RunTaskCommandInput): import("@smithy/smithy-client").CommandImpl<
    RunTaskCommandInput,
    RunTaskCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (input: RunTaskCommandInput): import("@smithy/smithy-client").CommandImpl<
    RunTaskCommandInput,
    RunTaskCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class RunTaskCommand extends RunTaskCommand_base {
  protected static __types: {
    api: {
      input: RunTaskRequest;
      output: RunTaskResponse;
    };
    sdk: {
      input: RunTaskCommandInput;
      output: RunTaskCommandOutput;
    };
  };
}
