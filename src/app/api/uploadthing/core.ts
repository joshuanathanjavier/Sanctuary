import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

type Metadata = {
  userId: string;
};

export const utapi = new UTApi();

export const ourFileRouter = {
  audioUploader: f({ audio: { maxFileSize: "32MB" } })
    .onUploadComplete(async ({ metadata, file }: { metadata?: Metadata; file: any }) => {
      try {
        if (!metadata) {
          console.warn("Metadata is undefined. Using default metadata.");
          metadata = { userId: "unknown" };  // Default userId
        }

        console.log("Upload complete:", file);
        console.log("Metadata:", metadata);

        // Return response with userId and file key
        return { uploadedBy: metadata.userId, key: file.key };
      } catch (error) {
        console.error("Error during metadata registration:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
