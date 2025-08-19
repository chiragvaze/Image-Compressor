// Modern Image Compressor with Drag and Drop
class ImageCompressor {
    constructor() {
        this.selectedFiles = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.filePreview = document.getElementById('filePreview');
        this.compressButton = document.getElementById('compressButton');
        this.output = document.getElementById('output');
    }

    bindEvents() {
        // File input events
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop events
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('drag-over');
        });

        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('drag-over');
        });

        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // Compress button
        this.compressButton.addEventListener('click', () => this.compressImages());
    }

    handleFiles(files) {
        const imageFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
        );

        imageFiles.forEach(file => {
            if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                this.selectedFiles.push(file);
            }
        });

        this.displayFiles();
        this.updateCompressButton();
    }

    displayFiles() {
        this.filePreview.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const img = document.createElement('img');
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);

            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => this.removeFile(index);

            fileItem.appendChild(img);
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            this.filePreview.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.displayFiles();
        this.updateCompressButton();
    }

    updateCompressButton() {
        this.compressButton.disabled = this.selectedFiles.length === 0;
    }

    async compressImages() {
        if (this.selectedFiles.length === 0) return;

        this.showLoading(true);

        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];
            try {
                const compressedFile = await this.compressImage(file);
                this.displayOutput(file, compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }

        this.showLoading(false);
        this.selectedFiles = [];
        this.displayFiles();
        this.updateCompressButton();
    }

    compressImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions (maintain aspect ratio)
                    const maxSize = 1920;
                    let { width, height } = img;

                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw image
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to blob
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], `compressed_${file.name}`, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.8);
                };

                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    displayOutput(originalFile, compressedFile) {
        const outputItem = document.createElement('div');
        outputItem.className = 'output-item';

        const originalSize = (originalFile.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
        const reduction = (((originalFile.size - compressedFile.size) / originalFile.size) * 100).toFixed(1);

        const img = document.createElement('img');
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(compressedFile);

        const info = document.createElement('div');
        info.className = 'output-info';
        info.innerHTML = `
            <h4>${compressedFile.name}</h4>
            <p>Original: ${originalSize} MB → Compressed: ${compressedSize} MB</p>
            <p>Reduction: ${reduction}%</p>
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => this.downloadFile(compressedFile);

        outputItem.appendChild(img);
        outputItem.appendChild(info);
        outputItem.appendChild(downloadBtn);
        this.output.appendChild(outputItem);
    }

    downloadFile(file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showLoading(show) {
        const btnText = this.compressButton.querySelector('.btn-text');
        const btnLoader = this.compressButton.querySelector('.btn-loader');

        if (show) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            this.compressButton.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            this.compressButton.disabled = false;
        }
    }
}

// Initialize the compressor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
});
