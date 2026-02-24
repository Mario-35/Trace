getElement('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (response.ok) {
        alert(`Image uploaded! ID: ${result.id}`);
    } else {
        alert('Error uploading image');
    }
});

getElement('retrieveButton').addEventListener('click', async function() {
    const id = getElement('imageId').value;
    const response = await fetch(`http://localhost:5000/image/${id}`);
    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const imagePreview = getElement('imagePreview');
        imagePreview.src = url;
        imagePreview.style.display = 'block';
    } else {
        alert('Error retrieving image');
    }
});