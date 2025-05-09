import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  DescribeServiceRevisionsRequest,
  DescribeServiceRevisionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeServiceRevisionsCommandInput
  extends DescribeServiceRevisionsRequest {}
export interface DescribeServiceRevisionsCommandOutput
  extends DescribeServiceRevisionsResponse,
    __MetadataBearer {}
declare const DescribeServiceRevisionsCommand_base: {
  new (
    input: DescribeServiceRevisionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServiceRevisionsCommandInput,
    DescribeServiceRevisionsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DescribeServiceRevisionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServiceRevisionsCommandInput,
    DescribeServiceRevisionsCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeServiceRevisionsCommand extends DescribeServiceRevisionsCommand_base {
  protected static __types: {
    api: {
      input: DescribeServiceRevisionsRequest;
      output: DescribeServiceRevisionsResponse;
    };
    sdk: {
      input: DescribeServiceRevisionsCommandInput;
      output: DescribeServiceRevisionsCommandOutput;
    };
  };
}
