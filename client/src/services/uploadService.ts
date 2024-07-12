import { uploadFile } from '@uploadcare/upload-client';


export default async function uploadImg(img: File) {
    const result = await uploadFile(
        img,
        {
            publicKey: '5eae6535ddcc16a19faf',
            store: 'auto',
            metadata: {
                subsystem: 'js-client',
                pet: 'cat'
            }
        }
    );
    return result.cdnUrl;
}