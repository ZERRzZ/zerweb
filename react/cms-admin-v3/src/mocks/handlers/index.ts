import { authHandlers } from './auth';
import { tableHandlers } from './protable';
import { chunkFileUpload, fileUpload } from './upload'
export const handlers = [
  ...authHandlers,
  ...tableHandlers,
  fileUpload,
  chunkFileUpload
];