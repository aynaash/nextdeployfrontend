import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ECSClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ECSClient";
import {
  ListServicesByNamespaceRequest,
  ListServicesByNamespaceResponse,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface ListServicesByNamespaceCommandInput
  extends ListServicesByNamespaceRequest {}
export interface ListServicesByNamespaceCommandOutput
  extends ListServicesByNamespaceResponse,
    __MetadataBearer {}
declare const ListServicesByNamespaceCommand_base: {
  new (
    input: ListServicesByNamespaceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListServicesByNamespaceCommandInput,
    ListServicesByNamespaceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListServicesByNamespaceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListServicesByNamespaceCommandInput,
    ListServicesByNamespaceCommandOutput,
    ECSClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListServicesByNamespaceCommand extends ListServicesByNamespaceCommand_base {
  protected static __types: {
    api: {
      input: ListServicesByNamespaceRequest;
      output: ListServicesByNamespaceResponse;
    };
    sdk: {
      input: ListServicesByNamespaceCommandInput;
      output: ListServicesByNamespaceCommandOutput;
    };
  };
}
