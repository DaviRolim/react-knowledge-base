import React, { use, useEffect, useState } from "react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { trpc } from "../utils/trpc";

const Images: NextPage = () => {
  const bucket = "react-knowledge-base";
  const key = "images/daviprofile.png";
  const params = {
    Bucket: bucket,
    Key: key,
  };
  const imageSrc = trpc.storage.getSignedUrlFromS3.useQuery(params);

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
  };

  return (
    <>
      <form onSubmit={uploadImage}>
        Upload Image
        <input type="file" onChange={onFileChange} />
        <button type="submit">Upload</button>
        <img src={imageSrc.data} alt="My Image" />
      </form>
    </>
  );
};

export default Images;
