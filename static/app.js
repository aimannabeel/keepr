const documentInput = document.querySelector("#documentInput");
const fileDetails = document.querySelector("#fileDetails");


documentInput.addEventListener("change", async() => {
  const selectedFile = documentInput.files[0];

  if (!selectedFile) {
    fileDetails.textContent = "No file selected yet.";
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

fileDetails.textContent = `${data.filename} - ${data.content_type} - ${data.size} bytes`;})