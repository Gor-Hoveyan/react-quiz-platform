import React, { useState } from "react";
import styles from './DragAndDrop.module.scss';
import { AiOutlineCloudUpload } from "react-icons/ai";
import useUserStore from "../../stores/userStore";

export default function DragAndDrop() {
    const [drag, setDrag] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const handleDropArea = useUserStore(state => state.handleDropArea);
    const setAvatar = useUserStore(state => state.setAvatar);

    function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(true);
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDrag(false);
        let files = e.dataTransfer.files;
        if (files.length > 1) {
            return setError('You can upload only one file');
        } else if (!files[0].type.includes('image')) {
            return setError('You can upload only images');
        }
        setError('')
        setAvatar(files[0]);
        handleDropArea(false);
    }

    function handleSelector(e: React.MouseEvent) {
        e.stopPropagation();
    }

    function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDrag(false);
        if (e.target.files?.length) {
            let files = e.target.files;
            if (files.length > 1) {
                return setError('You can upload only one file');
            } else if (!files[0].type.includes('image')) {
                return setError('You can upload only images');
            }
            setError('')
            setAvatar(files[0]);
            handleDropArea(false);
        }
    }

    return (
        <div className={styles.main} onClick={() => handleDropArea(false)}>
            {
                drag ?
                    <div className={styles.dropArea}
                        onDragStart={(e) => handleDragStart(e)}
                        onDragLeave={(e) => handleDragLeave(e)}
                        onDragOver={(e) => handleDragStart(e)}
                        onDrop={(e) => handleDrop(e)}
                    >Drop file here to upload</div>
                    :
                    <div className={styles.dragAndDrop}
                        onDragStart={(e) => handleDragStart(e)}
                        onDragLeave={(e) => handleDragLeave(e)}
                        onDragOver={(e) => handleDragStart(e)}
                        onDragExit={(e) => handleDragStart(e)}
                    >{error ? <pre className={styles.error}>
                        {error}
                        <br />
                        Drag file to try again
                    </pre>
                        :
                        <pre onClick={(e) => handleSelector(e)}>
                            Drag image here to upload
                            <br />
                            Or click on button to choose
                            <input onChange={(e) => handleSelect(e)} className={styles.inputFile} type='file' id='file' />
                            <label className={styles.inputFileLabel} htmlFor='file'>
                                <AiOutlineCloudUpload size={30} />
                            </label>
                        </pre>}
                    </div>
            }
        </div>
    )
}