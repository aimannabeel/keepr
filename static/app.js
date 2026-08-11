const checkBackendButton = document.querySelector("#checkBackendButton");
const backendStatus = document.querySelector("#backendStatus");

checkBackendButton.addEventListener("click", async () => {
  backendStatus.textContent = "checking backend...";

try {
  const response = await fetch("/api/health");
  const data = await response.json();
  
  backendStatus.textContent = data.message;
}
catch (error){
  backendStatus.textContent = "Could not reach the backend.";

}
});