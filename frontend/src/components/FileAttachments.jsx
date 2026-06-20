import React from "react";
import { Download, ExternalLink } from "lucide-react";
import { apiUrl } from "../utils/api";

const resolveAttachmentUrl = (attachment) => {
  if (attachment.external || attachment.url.startsWith("http")) {
    return attachment.url;
  }
  return apiUrl(attachment.url);
};

export const FileAttachments = ({ attachments = [] }) => {
  if (!attachments.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((attachment) => {
        const href = resolveAttachmentUrl(attachment);
        const isExternal = attachment.external || href.startsWith("http");

        return (
          <a
            key={attachment.type}
            href={href}
            download={isExternal ? undefined : attachment.filename}
            target="_blank"
            rel="noreferrer"
            data-testid={`download-${attachment.type}-pdf`}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#C5F250]/30
              bg-[#C5F250]/10
              px-3
              py-2
              text-[12px]
              font-medium
              text-[#C5F250]
              transition-colors
              hover:bg-[#C5F250]/20
              hover:border-[#C5F250]/50
            "
          >
            {isExternal ? <ExternalLink size={14} /> : <Download size={14} />}
            {attachment.label}
          </a>
        );
      })}
    </div>
  );
};
