import { FdpStorage } from '@fairdatasociety/fdp-storage';
import formatURL from '@utils/formatURL';

export interface FileResponse {
  access_time: string;
  block_size: number;
  content_type: string;
  creation_time: string;
  modification_time: string;
  name: string;
  size: string;
  raw: {
    version: 1;
    user_address: [];
    pod_name: string;
    file_path: string;
    file_name: string;
    file_size: number;
    block_size: number;
    content_type: string;
    compression: string;
    creation_time: number;
    access_time: number;
    modification_time: number;
    file_inode_reference: string;
  };
  reference: string;
}

interface DownloadFileData {
  filename: string;
  directory: string;
  podName: string;
}

interface ShareFileData {
  fileName: string;
  podName: string;
  path_file: string;
}

interface DeleteFileData {
  file_name: string;
  podName: string;
  path: string;
}

interface UploadFileData {
  file: File;
  directory: string;
  podName: string;
}

export const receiveFile = async (
  fdp: FdpStorage,
  reference: string,
  podName: string,
  directory: string
) => {
  try {
    const writePath = directory === 'root' ? '/' : '/' + formatURL(directory);

    const shareFileInfoResult = await fdp.file.saveShared(
      podName,
      writePath,
      reference
    );

    return shareFileInfoResult;
  } catch (error) {
    return error;
  }
};

export async function downloadFile(
  fdp: FdpStorage,
  data: DownloadFileData
): Promise<Blob> {
  const writePath =
    data.directory === 'root' ? '/' : '/' + formatURL(data.directory) + '/';

  console.log(`${writePath}`);

  const downloadFile = await fdp.file.downloadData(
    data.podName,
    `${writePath}${data.filename}`
  );

  return new Blob([downloadFile]);
}

export async function deleteFile(
  fdp: FdpStorage,
  data: DeleteFileData
): Promise<boolean> {
  await fdp.file.delete(data.podName, `${data.path}${data.file_name}`);

  return true;
}

export async function shareFile(
  fdp: FdpStorage,
  data: ShareFileData
): Promise<string> {
  const shareFileResult = await fdp.file.share(
    data.podName,
    data.path_file + data.fileName
  );

  return shareFileResult;
}

export async function uploadFile(
  fdp: FdpStorage,
  data: UploadFileData
): Promise<boolean> {
  const writePath =
    data.directory === 'root' ? '' : '/' + formatURL(data.directory);
  const f = await data.file.arrayBuffer();
  const fileBytes = new Uint8Array(f);
  await fdp.file.uploadData(
    data.podName,
    `${writePath}/${data.file.name}`,
    fileBytes
  );

  return true;
}
