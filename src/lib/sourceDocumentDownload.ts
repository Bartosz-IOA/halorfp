export type SourceDocumentItem = {
  name: string;
  desc: string;
  kind: 'pdf' | 'xlsx' | 'txt';
  /** When set, used for fetch; otherwise `/rfp-pack/<filename>`. */
  downloadUrl?: string;
};

export function sourceDocumentDownloadUrl(filename: string) {
  return `/rfp-pack/${encodeURIComponent(filename)}`;
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Returns true when the hosted file was downloaded; false when a placeholder was used. */
export async function downloadSourceDocument(doc: SourceDocumentItem): Promise<boolean> {
  const url = doc.downloadUrl ?? sourceDocumentDownloadUrl(doc.name);

  try {
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      triggerBlobDownload(blob, doc.name);
      return true;
    }
  } catch {
    /* fetch failed — fall through to placeholder */
  }

  const placeholder = [
    'EDGNEX RFP pack — document placeholder',
    '',
    `Filename: ${doc.name}`,
    `Type: ${doc.kind.toUpperCase()}`,
    '',
    'Description:',
    doc.desc,
    '',
    'The binary file is not hosted in this build. Place the issued file at:',
    `public${sourceDocumentDownloadUrl(doc.name)}`,
  ].join('\n');

  triggerBlobDownload(
    new Blob([placeholder], { type: 'text/plain;charset=utf-8' }),
    `${doc.name}.placeholder.txt`,
  );
  return false;
}

export async function downloadAllSourceDocuments(
  docs: SourceDocumentItem[],
  onProgress?: (message: string) => void,
) {
  onProgress?.(`Downloading 1 of ${docs.length}…`);
  for (let i = 0; i < docs.length; i++) {
    onProgress?.(`Downloading ${i + 1} of ${docs.length}…`);
    await downloadSourceDocument(docs[i]);
    if (i < docs.length - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 400));
    }
  }
  onProgress?.(`Finished ${docs.length} downloads.`);
}
