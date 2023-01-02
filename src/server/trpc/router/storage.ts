import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const storageRouter = router({
  getSignedUrlFromS3: publicProcedure
    .input(z.object({ Key: z.string(), Bucket: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // // Create the command.
        const command = new GetObjectCommand(input);

        // Create the presigned URL.
        const signedUrl = await getSignedUrl(ctx.s3Client, command, {
          expiresIn: 3600,
        });
        return signedUrl;
        // return "";
      } catch (error) {
        console.log(error);
        // add a default URL img if it fails
        return "";
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  createPutPresignedUrl: publicProcedure
    .input(
      z.object({
        Bucket: z.string(),
        ContentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // this will be private procedure so session and user will always be set here!
        // const userId = ctx.session!.user!.id;
        const userId = "davirolim";
        const image = await ctx.prisma.image.create({
          data: { userId: userId },
        });
        const key = `${image.userId}/${image.id}`;

        const command = new PutObjectCommand({
          Bucket: input.Bucket,
          Key: key,
          ContentType: input.ContentType,
        });
        const signedUrl = await getSignedUrl(ctx.s3Client, command, {
          expiresIn: 3600,
        });
        
        return signedUrl;


      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR"});
      }
    }),
});
