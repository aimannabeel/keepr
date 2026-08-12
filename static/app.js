const documentInput = document.querySelector("#documentInput");
const fileDetails = document.querySelector("#fileDetails");
const saveDocumentButton = document.querySelector("#saveDocumentButton");

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

  console.log("Saving document:", previewedDocument);
})