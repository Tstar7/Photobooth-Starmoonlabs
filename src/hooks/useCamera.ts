import { useState, useEffect, useRef, useCallback } from 'react';

export interface CameraState {
  stream: MediaStream | null;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  isMirrored: boolean;
  isDemoMode: boolean;
}

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const demoAnimRef = useRef<number | null>(null);

  // Enumerate video devices
  const updateDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevs);
      if (videoDevs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevs[0].deviceId);
      }
    } catch {
      // Ignore enumeration error
    }
  }, [selectedDeviceId]);

  // Stop current stream tracks
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, [stream]);

  // Start demo simulation mode
  const startDemoMode = useCallback(() => {
    stopStream();
    setIsDemoMode(true);
    setIsLoading(false);
    setError(null);
    setIsStreaming(true);
  }, [stopStream]);

  // Start real camera stream
  const startCamera = useCallback(
    async (deviceId?: string) => {
      setIsLoading(true);
      setError(null);
      stopStream();
      setIsDemoMode(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera API is not supported on this browser. Switching to Demo Mode.');
        startDemoMode();
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: deviceId ? undefined : 'user',
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setIsStreaming(true);
        setIsLoading(false);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }

        await updateDevices();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.name === 'NotAllowedError'
              ? 'Izin kamera ditolak. Mohon klik ikon kamera atau kunci di bilah alamat browser untuk mengizinkan kamera.'
              : err.name === 'NotFoundError'
              ? 'Tidak ditemukan kamera pada perangkat ini.'
              : err.message
            : 'Tidak dapat mengaktifkan kamera.';

        setError(errorMsg);
        setIsLoading(false);
      }
    },
    [stopStream, startDemoMode, updateDevices]
  );

  // Switch camera device
  const switchDevice = useCallback(
    (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      startCamera(deviceId);
    },
    [startCamera]
  );

  // Toggle mirror orientation
  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  // Capture current frame from video or demo canvas
  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;

    // Create high-res offscreen canvas
    const canvas = document.createElement('canvas');
    const width = 1280;
    const height = 960;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (isDemoMode || !video || video.readyState < 2) {
      // Draw cute Korean demo booth graphic frame
      const now = Date.now();
      const hue = (now / 30) % 360;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${hue}, 70%, 88%)`);
      grad.addColorStop(1, `hsl(${(hue + 45) % 360}, 75%, 82%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Cute character face
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 + 30, 240, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(width / 2 - 120, height / 2 + 60, 45, 0, Math.PI * 2);
      ctx.arc(width / 2 + 120, height / 2 + 60, 45, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(width / 2 - 80, height / 2 - 10, 18, 0, Math.PI * 2);
      ctx.arc(width / 2 + 80, height / 2 - 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 + 20, 60, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Caption
      ctx.font = 'bold 42px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText('인생네컷 📸 DEMO PHOTO', width / 2, height / 2 + 220);
      ctx.restore();

      return canvas.toDataURL('image/jpeg', 0.95);
    }

    // Real video capture
    ctx.save();
    if (isMirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Center crop video into canvas
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const vRatio = vWidth / vHeight;
    const targetRatio = width / height;

    let sx = 0;
    let sy = 0;
    let sWidth = vWidth;
    let sHeight = vHeight;

    if (vRatio > targetRatio) {
      sWidth = vHeight * targetRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      sHeight = vWidth / targetRatio;
      sy = (vHeight - sHeight) / 2;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isDemoMode, isMirrored]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (demoAnimRef.current) {
        cancelAnimationFrame(demoAnimRef.current);
      }
    };
  }, [stopStream]);

  return {
    videoRef,
    stream,
    devices,
    selectedDeviceId,
    isStreaming,
    isLoading,
    error,
    isMirrored,
    isDemoMode,
    startCamera,
    stopStream,
    switchDevice,
    toggleMirror,
    startDemoMode,
    capturePhoto,
  };
}
