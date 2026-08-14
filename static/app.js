const documentInput = document.querySelector("#documentInput");
const fileDetails = document.querySelector("#fileDetails");
const saveDocumentButton = document.querySelector("#saveDocumentButton");
const documentsList = document.querySelector("#documentsList");

let previewedDocument = null;
let selectedDocumentFile = null;

function formatSavedDate(createdAt){
    const normalisedCreatedAt = createdAt.includes("T")
        ? createdAt
        : createdAt.replace(" ", "T");
    const savedDate = new Date(normalisedCreatedAt);
    const now = new Date();

    const savedDay = savedDate.toDateString();
    const today = now.toDateString();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(now.getDate()-1);
    const yesterday = yesterdayDate.toDateString()

    if (savedDay === today) {
        return `Today, ${savedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    if (savedDay === yesterday){
        return "Yesterday";
    }

    if (savedDate.getFullYear() === now.getFullYear()){
        return savedDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
    });
    }

    return savedDate.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatContentType(contentType) {
    if (contentType === "application/pdf") {
        return "PDF";
    }

    if (contentType === "image/png") {
        return "PNG image";
    }

    if (contentType === "image/jpeg") {
        return "JPEG image";
    }

    return contentType;
}


documentInput.addEventListener("change", async() => {
    const selectedFile = documentInput.files[0];
    

    if (!selectedFile) {
        fileDetails.textContent = "No file selected yet.";
        previewedDocument = null;
        selectedDocumentFile = null;

        saveDocumentButton.disabled = true;
        return;
    }

    selectedDocumentFile = selectedFile;


    const formData = new FormData();
    formData.append("document", selectedFile);

    const response = await fetch("/api/documents/preview", {
    method: "POST",
    body: formData,
  });

    const data = await response.json();

    fileDetails.textContent = `${data.filename} - ${formatContentType(data.content_type)} - ${data.size} bytes`;

    saveDocumentButton.disabled = false;
    previewedDocument = data;
});

saveDocumentButton.addEventListener("click", async () =>{
    if (!selectedDocumentFile) {
        return;
    }

    const formData = new FormData();
    formData.append("document", selectedDocumentFile);

    const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    fileDetails.textContent = "File saved successfully!";
    saveDocumentButton.disabled = true;
    previewedDocument = null;
    selectedDocumentFile = null;
    await loadDocuments();
    });

async function loadDocuments() {
    const response = await fetch("/api/documents");
    const documents = await response.json();

    if (documents.length === 0) {
        documentsList.innerHTML = `<p class="empty-state">No saved documents yet.</p>`;
        return;
    }

    documentsList.innerHTML = "";

    documents.forEach((savedDocument) => {
      const documentRow = document.createElement("div");
      documentRow.className = "document-row";

      documentRow.innerHTML = `
      <span>${savedDocument.filename}</span>
      <span>${formatContentType(savedDocument.content_type)}</span>
      <span>${formatSavedDate(savedDocument.created_at)}</span>
      `;

      documentsList.appendChild(documentRow);
    });
    }

loadDocuments();
