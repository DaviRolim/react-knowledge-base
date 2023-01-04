import React from "react";
import { Box, Img } from "@chakra-ui/react";

type ImagePreviewProps = {
  file: File;
};

function ImagePreview({ file }: ImagePreviewProps) {
  const objectUrl = URL.createObjectURL(file);
  return (
    <Box w={24} p={2} h={12} flexWrap="wrap">
      <Img key={file.name} src={objectUrl} objectFit="cover" />
    </Box>
  );
}

export default ImagePreview;
