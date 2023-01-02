import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var s3Client: S3Client | undefined;
}

export const s3Client =
  global.s3Client ||
  new S3Client({
    region: env.AWS_REGION,
  });

if (env.NODE_ENV !== "production") {
  global.s3Client = s3Client;
}
