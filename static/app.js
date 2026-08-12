const documentInput = document.querySelector("#documentInput");
const fileDetails = document.querySelector("#fileDetails");
const saveDocumentButton = document.querySelector("#saveDocumentButton");
const documentsList = document.querySelector("#documentsList");

let previewedDocument = null;


documentInput.addEventListener("change", async() => {
  const selectedFile = documentInput.files[0];

  if (!selectedFile) {
    fileDetails.textContent = "No file selected yet.";
    previewedDocument = null;
    saveDocumentButton.disabled = true;
    return;
  }

  const formData = new FormData();
  formData.append("document", selectedFile);

  const response = await fetch("/api/documents/preview", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data);

fileDetails.textContent = `${data.filename} - ${data.content_type} - ${data.size} bytes`;

saveDocumentButton.disabled = false;
previewedDocument = data;
});

saveDocumentButton.addEventListener("click", async () =>{
  if (!previewedDocument) {
    return;
  }

  const response = await fetch("/api/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(previewedDocument),
  });
  fileDetails.textContent = "File saved successfully!";
  console.log("Saving document:", previewedDocument);
  await loadDocuments();
});

async function loadDocuments() {
  const response = await fetch("/api/documents");
  const documents = await response.json();

  if (documents.length === 0) {
    documentsList.innerHTML = `<p class=empty-state>No saved documents yet.</p>`;
    return;
  }

  documentsList.innerHTML = ""

  documents.forEach((savedDocument) => {
    const documentRow = document.createElement("div");
    documentRow.className = "document-row";

    documentRow.innerHTML = `
    <span>${savedDocument.filename}</span>
    <span>${savedDocument.content_type}</span>
    <span>${savedDocument.created_at}</span>
    `;

    documentsList.appendChild(documentRow);
  })
}

loadDocuments()