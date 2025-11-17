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

  if (!window.cloudinary) {
    console.error("Cloudinary widget script not loaded. Ensure the script tag is present in public/index.html.");
    alert("Upload widget not ready yet. Please try again in a moment.");
    return;
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.warn("Cloudinary env vars missing: REACT_APP_CLOUDINARY_CLOUD_NAME or REACT_APP_CLOUDINARY_UPLOAD_PRESET");
  }

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
        onError && onError(error);
        return;
      }
      if (result && result.event === "success") {
        // result.info has secure_url, public_id, width/height, etc.
        onSuccess && onSuccess(result.info);
      }
    }
  );

  widget.open();
  return widget;
}
