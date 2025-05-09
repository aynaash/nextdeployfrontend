import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  DescribeServiceDeploymentsRequest,
  DescribeServiceDeploymentsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeServiceDeploymentsCommandInput
  extends DescribeServiceDeploymentsRequest {}
export interface DescribeServiceDeploymentsCommandOutput
  extends DescribeServiceDeploymentsResponse,
    __MetadataBearer {}
declare const DescribeServiceDeploymentsCommand_base: {
  new (
    input: DescribeServiceDeploymentsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServiceDeploymentsCommandInput,
    DescribeServiceDeploymentsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DescribeServiceDeploymentsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServiceDeploymentsCommandInput,
    DescribeServiceDeploymentsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeServiceDeploymentsCommand extends DescribeServiceDeploymentsCommand_base {
  protected static __types: {
    api: {
      input: DescribeServiceDeploymentsRequest;
      output: DescribeServiceDeploymentsResponse;
    };
    sdk: {
      input: DescribeServiceDeploymentsCommandInput;
      output: DescribeServiceDeploymentsCommandOutput;
    };
  };
}
