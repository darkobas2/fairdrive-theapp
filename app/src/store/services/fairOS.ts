import axios from "axios";
import qs from "querystring";
import FileSaver from "file-saver";
import urlPath from '../helpers/urlPath';
interface Payload {
  username?: string;
  password?: string;
  mnemonic?: string
  address?: string;
  podName?: string;
  podReference?: string;
  file?: any;
  directory?: string;
  files?:any;
}

const host ="https://api.fairos.io/v0/";
const podName = "Fairdrive";

export async function createAccount(payload: Payload) {
  try {

    const response = await axios({
      baseURL: host,
      method: "POST",
      url: "user/signup",
      data: {
        user_name: payload.username,
        password: payload.password,
        mnemonic: payload.mnemonic,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.log("error on timeout", e);
  }
}

export const login = async (payload: Payload) => {
  try {
   const {username, password} = payload;

    const response = await axios({
      baseURL: host,
      url: "user/login",
      method: "POST",
      data: {
        user_name: username,
        password: password,
      },
      withCredentials: true,
    });

    const podResult = await getPods();
    if(!podResult.data.pod_name.includes(podName)){
      await createPod(password);
    };

    const resPod = await openPod(password,podName);
    
    return { res: response };
  } catch (error) {
    throw error;
  }
}

export const importUser = async( payload: Payload) =>{
  const response = await axios({
    baseURL: host,
    method: "POST",
    url: "user/import",
    data: {
      user_name: payload.username,
      password: payload.password,
      address: payload.address
    },
    withCredentials: true,
  });
  return response;
}

export const logOut = async () => {
  try {
    const response = await axios({
      baseURL: host,
      method: "POST",
      url: "user/logout",
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}


export const userLoggedIn = async (username: string) => {
  try {
    const requestBody = {
      user: username,
    };

    const response = await axios({
      method: "GET",
      url: "user/isloggedin",
      params: qs.stringify(requestBody, "brackets"),
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}

export const isUsernamePresent = async (username: string) => {
  try {
    const requestBody = {
      user_name: username,
    };

    const response = await axios({
      baseURL: host,
      method: "GET",
      url: "user/present",
      params: qs.stringify(requestBody, "brackets"),
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}

export const exportUser = async () => {
  try {
    const response = await axios({
      baseURL: host,
      method: "POST",
      url: "user/export",
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}


export const deleteUser = async (payload: Payload) => {
  try {
    const response = await axios({
      baseURL: host,
      method: "DELETE",
      url: "user/delete",
      data: {
        password: payload.password
      },
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}

export const userStats = async () => {
  try {
    const response = await axios({
      baseURL: host,
      method: "GET",
      url: "user/stat",
      withCredentials: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
}


export const createPod = async(password: string) =>{
  try{
      const openPod = await axios({
      baseURL: host,
      method: "POST",
      url: "pod/new",
      data: {pod_name: podName, password: password },
      withCredentials: true,
    });
    return true;
  } catch(err){
    return err;
  }
}

export const openPod = async(password: string, podName: string) =>{
  try{
      const openPod = await axios({
      baseURL: host,
      method: "POST",
      url: "pod/open",
      data: {pod_name: podName, password: password },
      withCredentials: true,
    });
    return openPod;
  } catch(err){
    return err;
  }
}

export const showReceivedPodInfo = async(payload: Payload) =>{
  const podResult = await axios({
    baseURL: host,
    method: "GET",
    url: "pod/receiveinfo",
    params:{reference:payload.podReference},
    withCredentials: true,
  });
  return podResult;
}


export const receivePod = async(payload: Payload) =>{
  const podResult = await axios({
    baseURL: host,
    method: "GET",
    url: "pod/receive",
    params:{reference:payload.podReference},
    withCredentials: true,
  });
  return podResult;
}

export const getPods = async() => {
  const podResult = await axios({
    baseURL: host,
    method: "GET",
    url: "pod/ls",
    withCredentials: true,
  });
  return podResult;
}




// export const fileUpload = async (fileData: any) => {
//   let formData = new FormData();
//   var file = new File([fileData.file], fileData.filename);
//   formData.append("files", file);
//   formData.append("pod_dir", "/" );
//   formData.append("block_size", "64Mb");
//   const uploadFiles = await axios({
//     baseURL: host,
//     method: "POST",
//     url: "file/upload",
//     data: formData,
//     withCredentials: true
//   });

//   return true;
// }


export const fileUpload = async (payload:Payload) => {
  const {files, directory} = payload;
  // const newPath = writePath(path);
  let writePath = "";
  if (directory == "root") {
    writePath = "/";
  } else {
    writePath = "/" + urlPath(directory);
  }
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  formData.append("pod_dir", writePath);
  formData.append("block_size", "64Mb");

  const uploadFiles = await axios({
    baseURL: host,
    method: "POST",
    url: "file/upload",
    data: formData,
    withCredentials: true,
  });

  console.log(uploadFiles);
  return true;
}

export const fileDownload = async (file:any, filename:any) => {
  try {
    const downloadFile = await axios({
      baseURL: host,
      method: "POST",
      url: "file/download",
      data: qs.stringify({ file: file }),
      responseType: "blob",
      withCredentials: true,
    });

    console.log(downloadFile);
    FileSaver.saveAs(downloadFile.data, filename);

    //const blob = new Blob(downloadFile.data)
    return downloadFile;
  } catch (error) {
    throw error;
  }
}

export const filePreview = async (file:any) => {
  try {
    const downloadFile = await axios({
      baseURL: host,
      method: "POST",
      url: "file/download",
      data: qs.stringify({ file: file }),
      responseType: "blob",
      withCredentials: true,
    });
    return downloadFile.data;
  } catch (error) {
    throw error;
  }
}

export const getDirectory = async (payload: Payload) => {
  const {directory, password, podName} = payload;
  try {
    // const openPod = await axios({
    //   baseURL: host,
    //   method: "POST",
    //   url: "pod/open",
    //   // add pod as function parameter
    //   data: qs.stringify({ password: password, pod: "Fairdrive"}),
    //   withCredentials: true,
    // });

    let data = { dir: "" };

    if (directory == "root") {
      data = {
        dir: "/",
      };
    } else {
      data = {
        dir: "/" + directory,
      };
    }
    const response = await axios({
      baseURL: host,
      method: "GET",
      url: "dir/ls",
      params: data,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

function dataURLtoFile(dataurl:any, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const storeAvatar = async (avatar:any) => {
  try {
    //Usage example:
    var file = dataURLtoFile(avatar, "avatar.jpg");

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios({
      baseURL: host,
      method: "POST",
      url: "user/avatar",
      data: formData,
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.log("error on timeout", e);
  }
}
export async function createDirectory(directoryName: string) {
  // Dir = "/" + path + "/"
  try {
    const createDirectory = await axios({
      baseURL: host,
      method: "POST",
      url: "dir/mkdir",
      data: qs.stringify({ dir: directoryName }),
      withCredentials: true,
    });

    return true;
  } catch (error) {}
}


async function readAsbase64(blob:any) {
  const tempFileReader = new FileReader();
  return new Promise((resolve, reject) => {
    tempFileReader.onerror = () => {
      tempFileReader.abort();
      reject(new DOMException("Problem with file"));
    };

    tempFileReader.onload = () => {
      resolve(tempFileReader.result);
    };
    tempFileReader.readAsDataURL(blob);
  });
}


export const deleteFile = async (fileName: string) => {
  try {
    const deletePictursDirectory = await axios({
      baseURL: host,
      method: "DELETE",
      url: "file/delete",
      params: {
        file: fileName,
      },
      withCredentials: true,
    });

    return true;
  } catch (error) {}
}

export const shareFile = async (fileName: string) => {
  try {
    const shareFileResult = await axios({
      baseURL: host,
      method: "POST",
      url: "file/share",
      params: {
        file: fileName,
        to: "anon",
      },
      withCredentials: true,
    });

    return shareFileResult.data.sharing_reference;
  } catch (error) {}
}


export const receiveFileInfo = async (reference: string) => {
  try {
    const shareFileInfoResult = await axios({
      baseURL: host,
      method: "POST",
      url: "file/receiveinfo",
      params: {
        ref: reference,
      },
      withCredentials: true,
    });

    return shareFileInfoResult.data;
  } catch (error) {}
}
