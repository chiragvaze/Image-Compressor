# Image Compressor 🖼️

A lightweight, web-based image compression tool that allows users to compress multiple image formats while maintaining quality. Built with vanilla JavaScript, HTML5, and CSS3 for optimal performance and compatibility.

## 🚀 Features

- **Multi-format Support**: Compress JPEG, PNG, WebP, and GIF images
- **Batch Processing**: Upload and compress multiple images simultaneously
- **Quality Control**: Adjustable compression settings (0-100% quality)
- **Real-time Preview**: See before/after comparisons with file size reduction
- **Drag & Drop**: Intuitive file upload interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **No Server Uploads**: All processing happens client-side for privacy
- **Download Options**: Individual or batch download of compressed images

## 🌐 Live Demo

👉 [Click here to try Image Compressor](https://chiragvaze.github.io/Image-Compressor/)

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Image Processing**: Canvas API, File API
- **Compression**: Built-in browser image compression
- **Styling**: CSS Grid, Flexbox
- **Icons**: Font Awesome (optional)

## 📁 Project Structure

```
Image-compressor/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── assets/             # Images and icons (optional)
```

## 🚦 Getting Started

### Prerequisites

- Modern web browser (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Local web server (recommended for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/image-compressor.git
   cd image-compressor
   ```

2. **Open in browser**
   - **Option 1**: Simply open `index.html` in your browser
   - **Option 2**: Use a local server for better development experience
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Access the application**
   - Navigate to `http://localhost:8000` (or your chosen port)

## 🎯 Usage

### Basic Usage

1. **Upload Images**
   - Click "Choose Files" or drag & drop images into the upload area
   - Supported formats: JPG, JPEG, PNG, WebP, GIF

2. **Configure Compression**
   - Adjust quality slider (0-100%)
   - Preview compression results in real-time

3. **Download Results**
   - Click "Download All" for batch download
   - Or download individual compressed images

### Advanced Features

- **Custom Output Format**: Convert between image formats
- **Resize Options**: Scale images while compressing
- **Metadata Removal**: Strip EXIF data for smaller file sizes
- **Progress Tracking**: Monitor compression progress for large files

## 🔧 Configuration

### Custom Settings

You can customize the compressor behavior by modifying these variables in `script.js`:

```javascript
// Default compression quality (0-100)
const DEFAULT_QUALITY = 80;

// Maximum file size for processing (in MB)
const MAX_FILE_SIZE = 10;

// Supported file types
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
```

### Styling Customization

Modify `styles.css` to change:
- Color scheme
- Layout dimensions
- Responsive breakpoints
- Animation effects

## 🧪 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full Support |
| Firefox | 55+     | ✅ Full Support |
| Safari  | 11+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |
| IE      | Any     | ❌ Not Supported |

## 🐛 Troubleshooting

### Common Issues

1. **"File too large" error**
   - Reduce file size or increase `MAX_FILE_SIZE` limit
   - Consider using WebP format for better compression

2. **Images not displaying**
   - Check browser console for errors
   - Ensure images are valid and not corrupted

3. **Slow compression**
   - Reduce image dimensions before compression
   - Lower the quality setting
   - Process fewer images at once

### Performance Tips

- Use WebP format for best compression ratios
- Process images in batches of 10-20 for optimal performance
- Close other browser tabs to free up memory
- Use hardware acceleration when available

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly across different browsers
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📊 Performance Benchmarks

| Format | Original Size | Compressed Size | Reduction |
|--------|---------------|-----------------|-----------|
| JPEG   | 2.5 MB        | 800 KB          | 68%       |
| PNG    | 1.8 MB        | 400 KB          | 78%       |
| WebP   | 2.0 MB        | 350 KB          | 82.5%     |

*Results may vary based on image content and quality settings*

## 🗺️ Roadmap

- [ ] Progressive Web App (PWA) support
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Advanced format conversion (AVIF, JPEG XL)
- [ ] Batch renaming functionality
- [ ] Image editing tools (crop, rotate, filters)
- [ ] ZIP file download for multiple images
- [ ] Dark mode theme
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Browser vendors for Canvas API and File API support
- Web development community for best practices
- Open-source contributors for inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/chiragvaze/image-compressor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chiragvaze/image-compressor/discussions)
- **Email**: chiragvaze.dev@gmail.com

---

**Made with ❤️ by Chirag Vaze**
