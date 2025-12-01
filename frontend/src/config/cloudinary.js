// Cloudinary configuration and helper to open the upload widget
// Reads values from environment variables set at build time
// Required env vars:
// - REACT_APP_CLOUDINARY_CLOUD_NAME
// - REACT_APP_CLOUDINARY_UPLOAD_PRESET (unsigned preset recommended for starter)

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "";

export { CLOUD_NAME, UPLOAD_PRESET };

/**
 * Open the Cloudinary Upload Widget.
 * @param {Object} options
 * @param {string} [options.folder="products"] - Cloudinary folder path for upload
 * @param {(info: any) => void} [options.onSuccess] - Called with result.info on success
 * @param {(error: any) => void} [options.onError] - Called with error on failure
 */
export function openUploadWidget({ folder = "products", onSuccess, onError } = {}) {
  if (typeof window === "undefined") return;

  // Check if Cloudinary script is loaded
  if (!window.cloudinary) {
    const errorMsg = "Cloudinary widget not loaded. Please refresh the page and try again.";
    console.error(errorMsg);
    alert(errorMsg);
    onError && onError(new Error(errorMsg));
    return;
  }

  // Validate environment variables
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    const errorMsg = `Missing Cloudinary configuration. Cloud: ${CLOUD_NAME ? 'OK' : 'MISSING'}, Preset: ${UPLOAD_PRESET ? 'OK' : 'MISSING'}`;
    console.error(errorMsg);
    alert("Upload is not configured. Please contact support.");
    onError && onError(new Error(errorMsg));
    return;
  }

  try {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder,
        multiple: false,
        sources: ["local", "url", "camera"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        showPoweredBy: false,
        cropping: false,
        theme: "minimal",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary widget error:", error);
          alert("Upload failed: " + (error.message || "Unknown error"));
          onError && onError(error);
          return;
        }
        if (result && result.event === "success") {
          console.log("Upload successful:", result.info.secure_url);
          onSuccess && onSuccess(result.info);
        }
      }
    );

    widget.open();
    return widget;
  } catch (err) {
    console.error("Failed to create Cloudinary widget:", err);
    alert("Failed to open upload dialog. Please try again.");
    onError && onError(err);
  }
}
