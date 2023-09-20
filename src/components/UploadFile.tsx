"use client"

import React, { ChangeEvent } from 'react';

interface Props {
  onFileUpload: (content: string) => void;
}

const UploadFile = ({ onFileUpload }:any): JSX.Element => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function(e: ProgressEvent<FileReader>) {
        if (e.target && typeof e.target.result === 'string') {
          onFileUpload(e.target.result);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input className="max-w-sm" title="html file upload" type="file" accept=".html" onChange={handleFileChange} />
    </div>
  );
}

export default UploadFile;
