import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  DescribeServicesRequest,
  DescribeServicesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DescribeServicesCommandInput extends DescribeServicesRequest {}
export interface DescribeServicesCommandOutput
  extends DescribeServicesResponse,
    __MetadataBearer {}
declare const DescribeServicesCommand_base: {
  new (
    input: DescribeServicesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServicesCommandInput,
    DescribeServicesCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DescribeServicesCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DescribeServicesCommandInput,
    DescribeServicesCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DescribeServicesCommand extends DescribeServicesCommand_base {
  protected static __types: {
    api: {
      input: DescribeServicesRequest;
      output: DescribeServicesResponse;
    };
    sdk: {
      input: DescribeServicesCommandInput;
      output: DescribeServicesCommandOutput;
    };
  };
}
