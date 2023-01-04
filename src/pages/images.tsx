import React, { use, useCallback, useEffect, useState } from "react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { trpc } from "../utils/trpc";
import { useDropzone } from "react-dropzone";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Flex,
  Center,
  HStack,
  Image,
  Img,
  Container,
} from "@chakra-ui/react";
import ImagePreviewGrid from "../components/image-page/ImagePreviewGrid";

const Images: NextPage = () => {
  const bucket = "react-knowledge-base";
  const limitFiles = 10;
  const utils = trpc.useContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visible, setVisible] = useState(false);

  /** Using the same time as the expires time on the backend
      on the backend the expires is in seconds and here it is in milliseconds
      stale time set to 10 hours */
  const imagesFromLoggedUser = trpc.storage.getAllImages.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 10,
  });

  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync } = trpc.storage.createPutPresignedUrl.useMutation();

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const signedUrls = await Promise.all(
      files.map(async (file) => {
        return await mutateAsync({
          Bucket: bucket,
          ContentType: file.type,
        });
      })
    );

    await Promise.all(
      signedUrls.map(async (signedUrl, index) => {
        const file = files[index];
        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: new Headers({ ContentType: file!.type }),
        });
      })
    );

    utils.storage.getAllImages.invalidate();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles) return;
    setFiles((prev) => [...prev, ...acceptedFiles]);

  }, []);

  const onModalClose = () => {
    setFiles([]);
    onClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: limitFiles,
  });

  return (
    <div className="min-h-[100vh] min-w-full">
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add File(s)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center
              bg="gray.100"
              fontSize="sm"
              color="gray.500"
              h={36}
              borderRadius={6}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              Drag and drop or click anywhere to add an image or video file
            </Center>
            <ImagePreviewGrid files={files} />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onModalClose} variant="ghost">
              Close
            </Button>
            <Button
              type="submit"
              onClick={() => uploadImage}
              colorScheme="blue"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="grid grid-cols-4 gap-4 m-2">
        {imagesFromLoggedUser.data?.map((image) => (
          <img src={image} alt="My Image" />
        ))}
      </div>

      <Flex justify="center" borderRadius="lg" m={4}>
        <Button onClick={onOpen}>Open Modal</Button>
      </Flex>
    </div>
  );
};

export default Images;
