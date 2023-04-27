const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const response = await fetch('/images/upload', {
        method: 'POST',
        body: formData
    });
    form.reset();
    const result = await response.json();
    if (result.success) {
        alert('Image uploaded successfully');
    }
    console.log(result);
});


const showImagesButton = document.getElementById('show-images');
showImagesButton.addEventListener('click', getImages);

// donne fuction getImages avec aussi bouton en bas de l'image pour l'effacer 
async function getImages() {
    const response = await fetch('/images/images');
    const images = await response.json();
    const imagesDiv = document.getElementById('images');
    imagesDiv.innerHTML = '';
    for (const image of images) {
        // Create a Uint8Array view of the image data
        const uint8Array = new Uint8Array(image.data.data);

        // Convert the Uint8Array to a binary string
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }

        // Encode the binary string in base64
        const base64String = btoa(binaryString);

        // Construct the data URL
        const dataUrl = `data:${image.contentType};base64,${base64String}`;

        // Create a container for the image and delete button
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.textAlign = 'center';
        imagesDiv.appendChild(container);

        // Use the data URL to display the image
        const img = document.createElement('img');
        img.src = dataUrl;
        container.appendChild(img);

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            // Send a DELETE request to the server to delete the image
            await fetch(`/images/images/${image._id}`, { method: 'DELETE' });
            // Reload the images
            getImages();
        });
        container.appendChild(deleteButton);
    }
}

document.getElementById("show-galleries").addEventListener("click", async () => {
    const response = await fetch("/images/galleries");
    const galleries = await response.json();
    const galleriesDiv = document.getElementById("galleries");
    galleriesDiv.innerHTML = "";
    galleries.forEach(gallery => {
        const galleryDiv = document.createElement("div");
        galleryDiv.innerHTML = `<h2>${gallery.name}</h2><p>${gallery.description}</p>`;
        galleriesDiv.appendChild(galleryDiv);
    });
});
