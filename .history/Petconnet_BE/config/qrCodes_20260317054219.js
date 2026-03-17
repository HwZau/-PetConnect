/**
 * QR Code Image Paths - Direct image references from frontend
 * Images are stored in: Petconnet_FE/public/images/qr-codes/
 */

module.exports = {
  // MoMo QR Code (0834339521 - Nguyễn Hữu Giàu)
  MOMO_QR: './images/qr-codes/qr-momo.png',
  
  // TPBank QR Code (02600647401 - richdesu)
  TPBANK_QR: '/images/qr-codes/qr-tpbank.png'
};

/**
 * HOW TO USE:
 * 1. Save the QR images from user as:
 *    - Petconnet_FE/public/images/qr-codes/qr-momo.png (MoMo)
 *    - Petconnet_FE/public/images/qr-codes/qr-tpbank.png (TPBank)
 * 2. Frontend will serve these images at the paths defined above
 * 3. When payment is created, these image URLs are returned to frontend
 * 4. Frontend displays the images directly (no base64 conversion needed)
 */

