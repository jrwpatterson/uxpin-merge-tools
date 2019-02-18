import * as requestPromise from 'request-promise';
import { DSMetadata } from '../../../program/DSMeta';
import { getAuthHeaders } from './headers/getAuthHeaders';
import { getUserAgentHeaders } from './headers/getUserAgentHeaders';

export interface PushMetadataResponse {
  message:string;
}

export async function postPushMetadata(
  domain:string,
  token:string,
  metadata:DSMetadata,
):Promise<PushMetadataResponse|null> {
  return requestPromise(`${domain}/code/v/1.0/push`, {
    body: metadata.result,
    headers: {
      ...getAuthHeaders(token),
      ...getUserAgentHeaders(),
    },
    json: true,
    method: 'POST',
  })
    .then((data:PushMetadataResponse|null) => data ? data : null);
}
