const documentInput = document.querySelector("#documentInput");
const documentsList = document.querySelector("#documentsList");
const appLayout = document.querySelector("#appLayout");
const viewDocumentsButton = document.querySelector("#viewDocumentsButton");
const allDocumentsList = document.querySelector("#allDocumentsList");
const documentModal = document.querySelector("#documentModal");
const modalFileName = document.querySelector("#modalFileName");
const cancelModalButton = document.querySelector("#cancelModalButton");
const modalSaveButton = document.querySelector("#modalSaveButton");

const displayNameInput = document.querySelector("#displayNameInput");
const ownerNameInput = document.querySelector("#ownerNameInput");
const documentTypeInput = document.querySelector("#documentTypeInput");
const tagsInput = document.querySelector("#tagsInput");
const documentsSearchInput = document.querySelector("#documentsSearchInput");
const expiryInput = document.querySelector("#expiryInput");

const documentActionsMenu = document.querySelector("#documentActionsMenu");
const editDocumentButton = document.querySelector("#editDocumentButton");
const deleteDocumentButton = document.querySelector("#deleteDocumentButton");



let previewedDocument = null;
let selectedDocumentFile = null;
let allDocuments = [];
let selectedActionDocumentId = null;
let modalMode = "create";
let editingDocumentId = null;
let deleteClickCount = 0;

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
        previewedDocument = null;
        selectedDocumentFile = null;
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

    previewedDocument = data;

    openDocumentModal(data.filename);
});

async function loadDocuments() {
    const response = await fetch("/api/documents/recent");
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

viewDocumentsButton.addEventListener("click", () => {    
    appLayout.classList.toggle("documents-open");

    if (appLayout.classList.contains("documents-open")) {
        viewDocumentsButton.textContent = "Close viewer";
    }
    else {
        viewDocumentsButton.textContent = "View documents";
    }
});

document.addEventListener("click", () => {
    documentActionsMenu.hidden = true;
    selectedActionDocumentId = null;
    deleteDocumentButton.textContent = "Delete";
    deleteClickCount = 0;
});

function renderAllDocuments(documents, emptyMessage = "No saved documents yet.") {
    if (documents.length === 0) {
        allDocumentsList.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
        return;
    }

    allDocumentsList.innerHTML = "";
    
    documents.forEach((savedDocument) => {
        const documentRow = document.createElement("div");
        documentRow.className = "document-row";

        documentRow.innerHTML = `
        <span>${getDocumentTitle(savedDocument)}</span>
        <span>${formatContentType(savedDocument.content_type)}</span>
        <span>${savedDocument.expiry_date || "-"}</span>
        <span class="document-actions">
        <button type="button" class="view-document-button" data-document-id="${savedDocument.id}">View</button>
        <button type="button" class="download-document-button" data-document-id="${savedDocument.id}">Download</button>
        <button type="button" class="more-actions-button" data-document-id="${savedDocument.id}">⋮</button>
        </span>
        `;

        const viewButton = documentRow.querySelector(".view-document-button");
        const downloadButton = documentRow.querySelector(".download-document-button");

        const moreActionsButton = documentRow.querySelector(".more-actions-button");

        viewButton.addEventListener("click", () => {
            const documentId = viewButton.dataset.documentId;
            window.open(`/api/documents/${documentId}/file`, "_blank");
        });

        downloadButton.addEventListener("click", () =>{
            const documentId = downloadButton.dataset.documentId;
            window.location.href = `/api/documents/${documentId}/download`;
        });

        moreActionsButton.addEventListener("click", (event) => {
            selectedActionDocumentId = moreActionsButton.dataset.documentId;

            const buttonPosition = moreActionsButton.getBoundingClientRect();

            documentActionsMenu.style.top = `${buttonPosition.bottom + 4}px`;
            documentActionsMenu.style.left = `${buttonPosition.right - 118}px`;

            documentActionsMenu.hidden = false;

            event.stopPropagation();
        });

        allDocumentsList.appendChild(documentRow);
    });
}

async function loadAllDocuments() {
    const response = await fetch("/api/documents");
    const documents = await response.json();

    allDocuments = documents;
    renderAllDocuments(allDocuments);
    
}

cancelModalButton.addEventListener("click", () => {
    closeDocumentModal();

    documentInput.value = "";
    selectedDocumentFile = null;
    previewedDocument = null;
});

modalSaveButton.addEventListener("click", async () =>{
    if (modalMode === "edit") {
        const formData = new FormData();
        formData.append("display_name", displayNameInput.value);
        formData.append("owner_name", ownerNameInput.value);
        formData.append("document_type", documentTypeInput.value);
        formData.append("tags", tagsInput.value);
        formData.append("expiry_date", expiryInput.value)

        const response = await fetch(`/api/documents/${editingDocumentId}`, {
            method: "PATCH",
            body: formData,
        });

        const data = await response.json();

        closeDocumentModal();

        modalMode = "create";
        editingDocumentId = null;
        modalSaveButton.textContent = "Save document";

        displayNameInput.value = "";
        ownerNameInput.value = "";
        documentTypeInput.value = "";
        tagsInput.value = "";
        expiryInput.value = "";

        await loadDocuments();
        await loadAllDocuments();

        return;
    }


     if (!selectedDocumentFile) {
        return;
    }

    const formData = new FormData();
    formData.append("document", selectedDocumentFile);
    formData.append("display_name", displayNameInput.value);
    formData.append("owner_name", ownerNameInput.value);
    formData.append("document_type", documentTypeInput.value);
    formData.append("tags", tagsInput.value);
    formData.append("expiry_date", expiryInput.value);

    const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    closeDocumentModal();

    documentInput.value = "";
    selectedDocumentFile = null;
    previewedDocument = null;

    displayNameInput.value = "";
    ownerNameInput.value = "";
    documentTypeInput.value = "";
    tagsInput.value = "";
    expiryInput.value = "";

    await loadDocuments();
    await loadAllDocuments();
});

function openDocumentModal(filename){
    modalFileName.textContent = filename;
    documentModal.hidden = false;
}

function closeDocumentModal(){
    documentModal.hidden = true;
}

function getDocumentTitle(savedDocument) {
    return savedDocument.display_name || savedDocument.filename;
}

documentsSearchInput.addEventListener("input", () => {
    const query = documentsSearchInput.value.toLowerCase().trim();

    if (query === "") {
        renderAllDocuments(allDocuments);
        return;
    }

    const searchWords = query.split(" ");

    const matchingDocuments = allDocuments.filter((savedDocument) => {
        const searchableText = `
        ${savedDocument.display_name || ""}
        ${savedDocument.filename || ""}
        ${savedDocument.owner_name || ""}
        ${savedDocument.document_type || ""}
        ${savedDocument.tags || ""}
        ${savedDocument.expiry_date || ""}
        `.toLowerCase();

        return searchWords.every((word) => searchableText.includes(word));
    });


    renderAllDocuments(matchingDocuments, "No documents found.");    
});

editDocumentButton.addEventListener("click", () => {
    const documentToEdit = allDocuments.find((savedDocument) => {
        return String(savedDocument.id) === selectedActionDocumentId;
    });
        
    if (!documentToEdit){
        return;
    }

    modalMode = "edit";
    editingDocumentId = documentToEdit.id;
    modalFileName.textContent = getDocumentTitle(documentToEdit);

    displayNameInput.value = documentToEdit.display_name || "";
    ownerNameInput.value = documentToEdit.owner_name || "";
    documentTypeInput.value = documentToEdit.document_type || "";
    tagsInput.value = documentToEdit.tags || "";
    expiryInput.value = documentToEdit.expiry_date || "";

    modalSaveButton.textContent = "Save changes";

    documentModal.hidden = false;
    documentActionsMenu.hidden = true;


});


deleteDocumentButton.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (!selectedActionDocumentId) {
        return;
    }

    deleteClickCount++;

    if (deleteClickCount === 1) {
        deleteDocumentButton.textContent = "Are you sure?";
        return;
    }

    const documentId = selectedActionDocumentId;

    const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        console.error("Delete failed");
        return;
    }

    documentActionsMenu.hidden = true;
    selectedActionDocumentId = null;

    deleteDocumentButton.textContent = "Delete";
    deleteClickCount = 0;

    await loadDocuments();
    await loadAllDocuments();
});

loadDocuments();
loadAllDocuments();
