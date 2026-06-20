import React, { useEffect, useState } from "react";
import { FileAttachments } from "./FileAttachments";
import { apiUrl } from "../utils/api";

export const DocumentDownloadLinks = ({ docTypes }) => {
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    let active = true;

    const loadDocuments = async () => {
      try {
        const response = await fetch(apiUrl("/documents"));
        if (!response.ok) return;

        const data = await response.json();
        if (!active) return;

        setAttachments(
          data.filter((attachment) => docTypes.includes(attachment.type)),
        );
      } catch {
        // Keep the section readable even if document metadata fails to load.
      }
    };

    loadDocuments();

    return () => {
      active = false;
    };
  }, [docTypes]);

  return <FileAttachments attachments={attachments} />;
};
