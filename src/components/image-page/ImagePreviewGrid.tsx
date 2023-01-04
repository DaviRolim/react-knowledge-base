import React from "react";
import ImagePreview from "./ImagePreview";

type ImagePreviewContainerProps = {
  files: File[];
};

function ImagePreviewGrid({ files }: ImagePreviewContainerProps) {
  return (
    <div className="mt-2 grid grid-cols-4 gap-y-4">
      {files.length > 0 &&
        files.map(function (file) {
          return <ImagePreview file={file} />;
        })}
    </div>
  );
}

export default ImagePreviewGrid;
