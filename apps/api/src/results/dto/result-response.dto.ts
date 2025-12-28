/**
 * Response DTO for uploaded result
 * Returned after successful upload
 */
export class ResultResponseDto {
  /**
   * Unique identifier for the result
   */
  id: string;

  /**
   * Title of the result
   */
  title: string;

  /**
   * Year or date
   */
  date: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Original filename
   */
  fileName: string;

  /**
   * Stored filename (may be different from original)
   */
  storedFileName: string;

  /**
   * File size in bytes
   */
  fileSize: number;

  /**
   * MIME type (should be application/pdf)
   */
  mimeType: string;

  /**
   * Public URL to access the PDF
   */
  url: string;

  /**
   * Upload timestamp
   */
  uploadedAt: Date;

  /**
   * User who uploaded (admin)
   */
  uploadedBy: string;
}
