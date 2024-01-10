import { useRef, useState } from "react";
import { FormError } from './FormError';
import { MAX_FILE_SIZE, ONE_MB } from '../util/constants';


export function UploadLog({ onUpload }: { onUpload: (content: string) => void}) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string|null>(null);

  const onParse = async () => {
    // reset state
    setFileError(null);
    console.log(fileInputRef);
    if (!fileInputRef.current) {
      setFileError('No file input');
      return;
    }
    const file = fileInputRef.current.files?.[0];
    // console.log(file);
    if (!file) {
      setFileError('No file selected');
      return;
    }
    // check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large. Max size is ${MAX_FILE_SIZE / ONE_MB} MB`);
      return;
    }
    // check if it's a text file
    // sometimes an empty type is returned for text files
    // so we check for that too
    if (file.type && !file.type.startsWith('text/')) {
      setFileError(`Not a text file. Identified mime type "${file.type}"`);
      return;
    }

    const logContent = await file.text();
    onUpload(logContent);
  };

  return (<>
      <h2>Upload your log</h2>
      <FormError error={fileError} />
      <div className="upload">
        <input type="file" ref={fileInputRef} />
        <button className="btn-upload" type="button" onClick={onParse}>Parse</button>
      </div>
  </>);
}
