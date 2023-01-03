import React, { use, useEffect, useState } from "react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { trpc } from "../utils/trpc";

const Images: NextPage = () => {
  const bucket = "react-knowledge-base";
  const utils = trpc.useContext();
  // Using the same time as the expires time in the backend - on the backend the expires is in seconds and here it is in milliseconds
  // stale time set to 10 hours
  const imagesFromLoggedUser = trpc.storage.getAllImages.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 10,
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const { mutateAsync } = trpc.storage.createPutPresignedUrl.useMutation();
  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFile(event.currentTarget.files?.[0]);
  };

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const signedUrl = await mutateAsync({
      Bucket: bucket,
      ContentType: file.type,
    });

    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: new Headers({ ContentType: file.type }),
    });

    utils.storage.getAllImages.invalidate();
  };

  return (
    <>
      <form onSubmit={uploadImage}>
        Upload Image
        <input type="file" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
      {imagesFromLoggedUser.data?.map((image) => (
        <img src={image} alt="My Image" />
      ))}
    </>
  );
};

export default Images;
