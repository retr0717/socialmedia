import * as FileSystem from 'expo-file-system';
import { decode }from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';

export const uploadFile = async (folderName : string, fileUri: string, isImage=true) => {
    try 
    {
        let fileName = getFilePath(folderName, isImage);

        //reading the image as base64.
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        //array buffer.
        let imageData = decode(fileBase64);
        let {data, error} = await supabase
        .storage
        .from('uploads')
        .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage ? 'image/*' : 'video/*'
        });

        if(error)
        {
            console.log("file upload failed : ", error);
            return {success: false, msg: 'Could not upload the file'};
        }

        return {success: true, data: data?.path};
    } 
    catch (error) 
    {
        console.log(error);
        return {success: false, msg: "Could not upload media"};
    }
}

export const getFilePath = (folderName: string, isImage : boolean) => {
    return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
}

export const getUserImageSrc = (imagePath: any) => {
    if(imagePath)
    {
        return getSupabaseFileUrl(imagePath);
    }
    else
    {
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl = (filePath:string) => {
    if(filePath){
        return {uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`};
    }

    return null;
}