// Image Compressor JavaScript
// Handles image compression, file processing, and UI interactions

// Global variables
let selectedFiles = [];
let compressedImages = [];

// DOM elements
const fileInput = document.getElementById('fileInput');
const compressButton = document.getElementById('compressButton');
const outputDiv = document.getElementById('output');

// Configuration
const CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    defaultQuality: 0.8,
    supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    fileInput.addEventListener('change', handleFileSelect);
    compressButton.addEventListener('click', compressImages);
});

/**
 * Handle file selection
 * @param {Event} event - File input change event
 */
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    // Filter valid image files
    selectedFiles = files.filter(file => {
        if (!CONFIG.supportedTypes.includes(file.type)) {
            showError(`Unsupported file type: ${file.type}`);
            return false;
        }
        if (file.size > CONFIG.maxFileSize) {
            showError(`File too large: ${file.name} (${formatFileSize(file.size)})`);
            return false;
        }
        return true;
    });

    if (selectedFiles.length > 0) {
        displaySelectedFiles();
        compressButton.disabled = false;
    }
}

/**
 * Display selected files in the UI
 */
function displaySelectedFiles() {
    const fileList = document.createElement('div');
    fileList.className = 'file-list';
    fileList.innerHTML = `
        <h3>Selected Files (${selectedFiles.length})</h3>
        <ul>
            ${selectedFiles.map(file => `
                <li>${file.name} (${formatFileSize(file.size)})</li>
            `).join('')}
        </ul>
    `;
    
    // Clear previous file list and add new one
    const existingList = outputDiv.querySelector('.file-list');
    if (existingList) existingList.remove();
    outputDiv.insertBefore(fileList, outputDiv.firstChild);
}

/**
 * Compress selected images
 */
async function compressImages() {
    if (selectedFiles.length === 0) {
        showError('No files selected');
        return;
    }

    compressButton.disabled = true;
    compressButton.textContent = 'Compressing...';
    
    compressedImages = [];
    outputDiv.innerHTML = '<div class="progress">Processing images...</div>';

    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const compressed = await compressImage(file, CONFIG.defaultQuality);
            compressedImages.push(compressed);
            
            // Update progress
            const progress = Math.round(((i + 1) / selectedFiles.length) * 100);
            outputDiv.querySelector('.progress').textContent = `Processing... ${progress}%`;
        }
        
        displayCompressedImages();
    } catch (error) {
        showError('Compression failed: ' + error.message);
    } finally {
        compressButton.disabled = false;
        compressButton.textContent = 'Compress Images';
    }
}

/**
 * Compress a single image
 * @param {File} file - Image file to compress
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Object>} - Compressed image data
 */
function compressImage(file, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions (maintain aspect ratio)
                const maxSize = 1920;
                let { width, height } = img;
                
                if (width > height && width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with compression
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve({
                            originalFile: file,
                            compressedBlob: blob,
                            originalSize: file.size,
                            compressedSize: blob.size,
                            compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1)
                        });
                    } else {
                        reject(new Error('Failed to create compressed blob'));
                    }
                }, file.type, quality);
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Display compressed images with download options
 */
function displayCompressedImages() {
    outputDiv.innerHTML = '';
    
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results';
    resultsDiv.innerHTML = `
        <h3>Compression Results</h3>
        <div class="download-all">
            <button onclick="downloadAllImages()" class="btn">Download All (${formatFileSize(compressedImages.reduce((sum, img) => sum + img.compressedSize, 0))})</button>
        </div>
    `;
    
    const imagesGrid = document.createElement('div');
    imagesGrid.className = 'images-grid';
    
    compressedImages.forEach((image, index) => {
        const imageCard = createImageCard(image, index);
        imagesGrid.appendChild(imageCard);
    });
    
    resultsDiv.appendChild(imagesGrid);
    outputDiv.appendChild(resultsDiv);
}

/**
 * Create a card for displaying compressed image
 * @param {Object} image - Compressed image data
 * @param {number} index - Image index
 * @returns {HTMLElement} - Image card element
 */
function createImageCard(image, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    const url = URL.createObjectURL(image.compressedBlob);
    
    card.innerHTML = `
        <h4>${image.originalFile.name}</h4>
        <img src="${url}" alt="${image.originalFile.name}" style="max-width: 100%; height: auto;">
        <div class="image-info">
            <p><strong>Original:</strong> ${formatFileSize(image.originalSize)}</p>
            <p><strong>Compressed:</strong> ${formatFileSize(image.compressedSize)}</p>
            <p><strong>Reduction:</strong> ${image.compressionRatio}%</p>
        </div>
        <button onclick="downloadImage(${index})" class="btn">Download</button>
    `;
    
    return card;
}

/**
 * Download a single compressed image
 * @param {number} index - Image index
 */
function downloadImage(index) {
    const image = compressedImages[index];
    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Download all compressed images as a ZIP
 */
function downloadAllImages() {
    if (compressedImages.length === 1) {
        downloadImage(0);
        return;
    }
    
    // For multiple files, create individual downloads
    compressedImages.forEach((_, index) => {
        setTimeout(() => downloadImage(index), index * 500);
    });
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
    `;
    errorDiv.textContent = message;
    
    outputDiv.insertBefore(errorDiv, outputDiv.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Handle dropped files
document.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => CONFIG.supportedTypes.includes(file.type));
    
    if (imageFiles.length > 0) {
        selectedFiles = imageFiles;
        displaySelectedFiles();
        compressButton.disabled = false;
    }
});

// Add visual feedback for drag and drop
document.addEventListener('dragover', (e) => {
    document.body.classList.add('drag-over');
});

document.addEventListener('dragleave', () => {
    document.body.classList.remove('drag-over');
});

document.addEventListener('drop', () => {
    document.body.classList.remove('drag-over');
});

// Add CSS for drag over state
const style = document.createElement('style');
style.textContent = `
    .drag-over {
        background-color: rgba(52, 152, 219, 0.1);
        border: 2px dashed #3498db;
    }
    
    .file-list, .results {
        margin: 20px 0;
    }
    
    .images-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .image-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background: white;
    }
    
    .image-info {
        margin: 10px 0;
        font-size: 14px;
    }
    
    .download-all {
        margin: 20px 0;
        text-align: center;
    }
`;
document.head.appendChild(style);
