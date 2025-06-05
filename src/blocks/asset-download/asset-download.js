import { getDocFileExtension } from '../../scripts/tools.js';

const allDownloadableLinks = [];
const downloadBtn = document.createElement('a');
const generateBlob = () =>
  Promise.all(
    allDownloadableLinks.map((url) =>
      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {
          // store the file name
          blob.name = url.slice(url.lastIndexOf('/') + 1);
          return blob;
        }),
    ),
  );

const packToZip = (blobs) => {
  if (window.JSZip) {
    const zip = new window.JSZip();
    // const folder = zip.folder('downloaded_documents');
    // blobs.forEach((blob) => folder.file(blob.name, blob));
    // const folder = zip.folder('downloaded_documents');
    blobs.forEach((blob) => zip.file(blob.name, blob));
    const zipfile = zip.generateAsync({ type: 'blob' });
    return zipfile;
  }
  return null;
};

const generateBlobFile = () => {
  generateBlob()
    .catch((e) => console.error(e, 'File could not be generated 1'))
    .then(packToZip)
    .catch((e) => console.error(e, 'File could not be generated 2'))
    .then((zipfile) => {
      if (downloadBtn && zipfile) {
        downloadBtn.addEventListener('click', (event) => {
          event.preventDefault();
          const blobUrl = URL.createObjectURL(zipfile);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'wmk_downloads.zip';
          document.body.appendChild(link);
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            }),
          );
          document.body.removeChild(link);
        });
      }
    })
    .catch((e) => console.error(e, 'File could not be generated 3'));
};

export default function decorate(block) {
  const textContent = block.children[0];
  if (textContent) {
    textContent.classList.add('text-content');
  }
  const title = textContent.children[0];
  if (title) {
    title.classList.add('title');
  }
  const links = textContent.children[2];
  if (links && links.querySelector('p')) {
    links.classList.add('download-link');
    const pquery = links.querySelector('p');
    // pquery.classList.add('link');
    downloadBtn.setAttribute('href', '#');
    downloadBtn.textContent = pquery.textContent;
    pquery.replaceWith(downloadBtn);
  }
  // Collect all the divs except the 'text-content' div and put them in a single div
  const otherDivs = Array.from(block.children).filter((div) => div !== textContent);
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('assets-container');
  otherDivs.forEach((div) => containerDiv.appendChild(div));
  block.appendChild(containerDiv);
  const assetsContainer = document.querySelector('.assets-container');
  const childDivs = assetsContainer.children;
  // Get all the child divs of the three parent divs
  const grandChildDivs = Array.from(childDivs).map((div) => Array.from(div.children));
  // Flatten the array of arrays into a single array
  const allGrandChildDivs = grandChildDivs.flat();
  // Remove the parent divs
  Array.from(childDivs).forEach((div) => div.remove());
  // Append the child divs to the assets-container
  allGrandChildDivs.forEach((div) => assetsContainer.appendChild(div));
  // Make the 'Download' p tag a download link for the respective sibling p tag having an asset
  const divs = Array.from(assetsContainer.children);
  setTimeout(() => {
    divs.forEach((div, index) => {
      const downloadableLink = div.querySelector('p:nth-child(3) em a');
      if (downloadableLink && downloadableLink.getAttribute('href')) {
        const extn = getDocFileExtension((downloadableLink.href || '').toLowerCase());
        if (
          extn &&
          downloadableLink.getAttribute('href') &&
          downloadableLink.href.toLowerCase().includes('wellmark.com')
        ) {
          const downloadableURLDetails = new URL(downloadableLink.href);
          downloadableURLDetails.hash = '';
          downloadableURLDetails.search = '';
          allDownloadableLinks.push(downloadableURLDetails.toString());
        }

        const downloadText = div.querySelector('p:nth-child(2)');
        const downloadAnchor = document.createElement('a');
        downloadAnchor.classList.add('asset-download-anchor');
        downloadAnchor.textContent = downloadText.textContent;
        downloadAnchor.setAttribute('href', downloadableLink.getAttribute('href'));
        downloadText.replaceWith(downloadAnchor);

        if (extn === 'pdf') {
          downloadAnchor.innerHTML = `${downloadAnchor.textContent}<i class="fa-regular fa-file-pdf"></i>`;
        } else {
          downloadAnchor.innerHTML = `${downloadAnchor.textContent}<i class="fa-regular fa-download"></i>`;
        }

        const downloadImg = div.querySelector('p:nth-child(1)');
        const downloadAnchor2 = document.createElement('a');
        downloadAnchor2.classList.add('asset-download-img');
        downloadAnchor2.innerHTML = downloadImg.innerHTML;
        downloadAnchor2.setAttribute('href', downloadableLink.getAttribute('href'));
        downloadImg.replaceWith(downloadAnchor2);

        downloadableLink.closest('p').remove();
        downloadAnchor2.setAttribute('target', '_blank');
        downloadAnchor.setAttribute('target', '_blank');
        if (index === Array.from(assetsContainer.querySelectorAll('em')).length - 1) {
          generateBlobFile();
        }
      }
    });
  }, 1500);
}
