import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  ListServiceDeploymentsRequest,
  ListServiceDeploymentsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListServiceDeploymentsCommandInput
  extends ListServiceDeploymentsRequest {}
export interface ListServiceDeploymentsCommandOutput
  extends ListServiceDeploymentsResponse,
    __MetadataBearer {}
declare const ListServiceDeploymentsCommand_base: {
  new (
    input: ListServiceDeploymentsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListServiceDeploymentsCommandInput,
    ListServiceDeploymentsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListServiceDeploymentsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListServiceDeploymentsCommandInput,
    ListServiceDeploymentsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListServiceDeploymentsCommand extends ListServiceDeploymentsCommand_base {
  protected static __types: {
    api: {
      input: ListServiceDeploymentsRequest;
      output: ListServiceDeploymentsResponse;
    };
    sdk: {
      input: ListServiceDeploymentsCommandInput;
      output: ListServiceDeploymentsCommandOutput;
    };
  };
}
