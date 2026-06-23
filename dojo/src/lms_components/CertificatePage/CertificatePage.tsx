



import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, FileDown, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { API_URL } from '../CreateCourse/components/Utils/utils';

interface CourseCompletionData {
  course_id: number;
  course_title: string;
  employee_id: number;
  employee_name: string;
  completion_date: string;
  certificate_id: string;
  grade_or_percentage: number;
}

const CertificatePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [certificateData, setCertificateData] = useState<CourseCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const getToken = useCallback((): string | null => {
    try {
      const authDataString = localStorage.getItem("auth");
      if (!authDataString) return null;
      const authData = JSON.parse(authDataString);
      return authData.accessToken || authData.access || null;
    } catch (e) {
      console.error("Error parsing auth token:", e);
      return null;
    }
  }, []);

  const token = getToken();
  const FETCH_CERTIFICATE_API = `${API_URL}/courses/${courseId}/certificate/`;

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      if (!courseId) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(FETCH_CERTIFICATE_API, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to fetch certificate.`);
        }

        const data: CourseCompletionData = await response.json();
        setCertificateData(data);

      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId, token, navigate, FETCH_CERTIFICATE_API]);

  const handleDownloadPdf = useCallback(async () => {
    if (!certificateRef.current || !certificateData) {
      setDownloadError('Certificate not ready. Please refresh and try again.');
      return;
    }
    
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      await document.fonts?.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = certificateRef.current;
      
      element.style.display = 'block';
      void element.offsetHeight;

      const computedStyle = window.getComputedStyle(element);
      const width = parseFloat(computedStyle.width);
      const height = parseFloat(computedStyle.height);

      if (!width || !height || width < 10 || height < 10) {
        throw new Error(`Invalid dimensions: ${width}x${height}`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFBEB',
        logging: false,
        width: Math.ceil(width),
        height: Math.ceil(height),
        windowWidth: Math.ceil(width),
        windowHeight: Math.ceil(height),
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.width = `${width}px`;
          clonedElement.style.height = `${height}px`;
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
          clonedElement.style.transform = 'none';
        }
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas generation failed');
      }

      // Create PDF - A4 Landscape for maximum size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
      
      // Minimal padding to maximize certificate size
      const padding = 5;
      const availableWidth = pageWidth - (padding * 2);
      const availableHeight = pageHeight - (padding * 2);

      const imgRatio = canvas.width / canvas.height;
      const pageRatio = availableWidth / availableHeight;

      let imgWidth: number, imgHeight: number, offsetX: number, offsetY: number;

      if (imgRatio > pageRatio) {
        imgWidth = availableWidth;
        imgHeight = availableWidth / imgRatio;
        offsetX = padding;
        offsetY = padding + (availableHeight - imgHeight) / 2;
      } else {
        imgHeight = availableHeight;
        imgWidth = availableHeight * imgRatio;
        offsetX = padding + (availableWidth - imgWidth) / 2;
        offsetY = padding;
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);

      const cleanName = certificateData.employee_name.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Certificate_${cleanName}.pdf`);
      
    } catch (err) {
      console.error('PDF generation error:', err);
      setDownloadError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [certificateData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${getOrdinal(day)} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Generating Your Certificate</h2>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <Award size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Certificate Error</h2>
          <p className="text-gray-600 mb-6">{error || "Could not retrieve certificate data."}</p>
          <button
            onClick={() => navigate(`/lms/courses/${courseId}`)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold"
          >
            <ArrowLeft size={20} className="inline mr-2" /> Back to Course
          </button>
        </div>
      </div>
    );
  }

  const completionDate = formatDate(certificateData.completion_date);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <button
          onClick={() => navigate(`/lms/certificateHome/`)}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          data-html2canvas-ignore="true"
        >
          <ArrowLeft size={20} />
          Back to Course
        </button>

        {/* CERTIFICATE - BIGGER SIZE with A4 landscape ratio */}
        <div 
          ref={certificateRef}
          style={{
            width: '1050px',      // Increased width
            height: '840px',      // Increased height (A4 landscape ratio ~1.414)
            maxWidth: '100%',
            margin: '0 auto',
            position: 'relative',
            backgroundColor: '#FFFBEB',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Outer Border */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            bottom: '12px',
            border: '5px solid #D97706',
            borderRadius: '8px',
            pointerEvents: 'none',
          }} />
          
          {/* Inner Border */}
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '28px',
            right: '28px',
            bottom: '28px',
            border: '2px solid #F59E0B',
            borderRadius: '6px',
            pointerEvents: 'none',
          }} />

          {/* Corner Decorations - Top Left */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '50px',
            height: '50px',
            borderTop: '4px solid #B45309',
            borderLeft: '4px solid #B45309',
          }} />
          {/* Top Right */}
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '50px',
            height: '50px',
            borderTop: '4px solid #B45309',
            borderRight: '4px solid #B45309',
          }} />
          {/* Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '50px',
            height: '50px',
            borderBottom: '4px solid #B45309',
            borderLeft: '4px solid #B45309',
          }} />
          {/* Bottom Right */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '50px',
            height: '50px',
            borderBottom: '4px solid #B45309',
            borderRight: '4px solid #B45309',
          }} />

          {/* Certificate Content - More padding */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '70px 80px',  // Increased padding
            boxSizing: 'border-box',
          }}>
            
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p style={{ 
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '15px',
                color: '#B45309',
                letterSpacing: '6px',
              }}>
                Learning Management System
              </p>
              <h1 style={{ 
                fontSize: '52px',
                fontWeight: 'bold',
                fontFamily: 'Georgia, Times, serif',
                color: '#92400E',
                margin: '0',
                lineHeight: 1.2,
              }}>
                Certificate of Completion
              </h1>
            </div>

            {/* Award Icon with decorative lines */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '30px',
              gap: '20px',
            }}>
              <div style={{
                width: '100px',
                height: '2px',
                backgroundColor: '#D97706',
              }} />
              <Award style={{ 
                width: '44px', 
                height: '44px', 
                color: '#D97706',
              }} />
              <div style={{
                width: '100px',
                height: '2px',
                backgroundColor: '#D97706',
              }} />
            </div>

            {/* Main Content - Flex grow to fill space */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',  // Consistent gap between items
            }}>
              
              <p style={{ 
                fontSize: '18px',
                marginBottom: '12px',
                fontFamily: 'Georgia, Times, serif',
                color: '#4B5563',
              }}>
                This is to certify that
              </p>
              
              {/* Recipient Name with separate underline */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '15px',
              }}>
                <h2 style={{ 
                  fontSize: '40px',
                  fontWeight: 'bold',
                  fontFamily: 'Georgia, Times, serif',
                  color: '#111827',
                  margin: '0',
                  lineHeight: 1.3,
                }}>
                  {certificateData.employee_name}
                </h2>
                {/* Separate underline */}
                <div style={{ 
                  width: '350px',
                  height: '3px',
                  backgroundColor: '#D97706',
                  margin: '12px auto 0 auto',
                  borderRadius: '2px',
                }} />
              </div>

              <p style={{ 
                fontSize: '18px',
                margin: '20px 0',
                fontFamily: 'Georgia, Times, serif',
                color: '#4B5563',
              }}>
                has successfully completed the course
              </p>

              {/* Course Title */}
              <div style={{ 
                backgroundColor: '#FEF3C7',
                border: '2px solid #FCD34D',
                borderRadius: '10px',
                padding: '16px 40px',
                marginBottom: '20px',
                maxWidth: '85%',
              }}>
                <h3 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fontFamily: 'Georgia, Times, serif',
                  color: '#92400E',
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  "{certificateData.course_title}"
                </h3>
              </div>

              {/* Score Badge */}
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#DCFCE7',
                border: '2px solid #86EFAC',
                borderRadius: '25px',
                padding: '10px 28px',
                marginBottom: '20px',
              }}>
                <CheckCircle style={{ width: '22px', height: '22px', color: '#15803D' }} />
                <span style={{ 
                  fontSize: '18px', 
                  color: '#166534', 
                  fontWeight: 700,
                }}>
                  Score: {certificateData.grade_or_percentage.toFixed(1)}%
                </span>
              </div>

              {/* Date */}
              <p style={{ 
                fontSize: '16px',
                fontFamily: 'Georgia, Times, serif',
                color: '#6B7280',
                margin: 0,
              }}>
                Awarded on <span style={{ color: '#92400E', fontWeight: 600 }}>{completionDate}</span>
              </p>
            </div>

            {/* Footer - Signatures with more spacing */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingTop: '30px',
              marginTop: '20px',
            }}>
              {/* Left Signature */}
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ 
                  width: '180px',
                  height: '2px',
                  backgroundColor: '#92400E',
                  margin: '0 auto 12px auto',
                }} />
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#92400E',
                  margin: 0,
                }}>
                  Course Instructor
                </p>
              </div>

              {/* Certificate ID - Center */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ 
                  fontSize: '10px',
                  color: '#9CA3AF',
                  margin: '0 0 6px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  Certificate ID
                </p>
                <p style={{ 
                  fontSize: '13px',
                  fontFamily: 'Consolas, Monaco, monospace',
                  color: '#6B7280',
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: '1px',
                }}>
                  {certificateData.certificate_id}
                </p>
              </div>

              {/* Right Signature */}
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ 
                  width: '180px',
                  height: '2px',
                  backgroundColor: '#92400E',
                  margin: '0 auto 12px auto',
                }} />
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#92400E',
                  margin: 0,
                }}>
                  LMS Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {downloadError && (
          <div 
            className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-center"
            data-html2canvas-ignore="true"
          >
            <p className="text-red-700 text-sm font-medium">{downloadError}</p>
            <button 
              onClick={() => setDownloadError(null)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div 
          className="mt-8 flex flex-wrap items-center justify-center gap-4" 
          data-html2canvas-ignore="true"
        >
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <FileDown size={24} />
            )}
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 rounded-xl font-semibold text-lg transition-all"
          >
            🖨️ Print Certificate
          </button>
        </div>

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          button, [data-html2canvas-ignore] { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;